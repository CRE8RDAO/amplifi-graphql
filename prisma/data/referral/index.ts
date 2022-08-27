import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import {
  fetchCSV,
} from '../../utils/csv';
import { fetchGithubSybil, TwitterToAddresses } from '../verified-twitter';
import { isEthereumAddress } from 'class-validator';

interface Referral {
  'Referee Address': string;
  UTM_CAMPAIGN: string;
  UTM_CONTENT: string;
  UTM_SOURCE: string;
  'Entry Date': string;
}

export const seedReferrals = async (prisma: PrismaClient) => {
  const rawReferrals = await fetchReferrals();
  await createReferrals(prisma, rawReferrals);
};

const fetchReferrals = async (): Promise<Referral[]> => {
  const fileLocation = resolve(__dirname, './referral.csv');
  const referralHeaders = [
    'Referee Address',
    'UTM_CAMPAIGN',
    'UTM_CONTENT',
    'UTM_SOURCE',
    'Entry Date',
  ];
  return fetchCSV<Referral>(fileLocation, referralHeaders)
};

const createReferrals = async (
  prisma: PrismaClient,
  referrals: Array<Referral>,
) => {
  await createUsers(prisma, referrals)
  await createCampaigns(prisma, referrals)
  await createReferrers(prisma, referrals)
  //note: referees need to be created last
  await createReferees(prisma, referrals)
};

const createUsers = async (
  prisma: PrismaClient,
  referrals: Array<Referral>,
) => {
  const {addressToTwitter} = fetchGithubSybil();
  const addresses = Object.keys(addressToTwitter)
  for (const a of addresses) {
    try {
      await prisma.user.create({
        data: {
          address: a,
          twitterHandle: addressToTwitter[a]
        },
      });
      console.log(`Created user with id: ${a}`);
    } catch (e) {
    }
  }
  for (const u of referrals) {
    if (isEthereumAddress(u['Referee Address'])) {
      try {
        await prisma.user.create({
          data: {
            address: u['Referee Address'],
          },
        });
        console.log(`Created user with id: ${u['Referee Address']}`);
      } catch (e) {
        
      }
    }
  }
}

const createCampaigns = async (
  prisma: PrismaClient,
  referrals: Array<Referral>,
) => {
  for (const u of referrals) {
    try {
      const campaignSlug = getCampaignSlug(u)
      if (campaignSlug == '') {
        continue; 
      }
      const campaign = await prisma.campaign.create({
        data: {
          slug: campaignSlug,
        },
      });
      console.log(`Created campaign with id: ${campaign.id}`);
    } catch (e) {}
  }
  return true
}


const createReferrers = async (
  prisma: PrismaClient,
  referrals: Array<Referral>,
) => {
  const {twitterToAddresses} = fetchGithubSybil();
  for (let u of referrals) {
    let referrerAddress : string;
    
    const addressRes = getReferrerAddress(u, twitterToAddresses)
    if (addressRes.error) {
      continue;
    } else {
      referrerAddress = addressRes.address
    }
    try {
      await prisma.referrer.create({
        data: {
          address: referrerAddress,
        },
      });
      console.log(`Created referrer with id: ${referrerAddress}`);
    } catch (e) {
      //   console.log(`Failed to add ${address}`)
    }
  }
  
}



/**
 * This should be run AFTER generating users and campaigns and referrers
 * @param prisma 
 * @param referrals 
 */
const createReferees = async (
  prisma: PrismaClient,
  referrals: Array<Referral>,
) => {
  const {twitterToAddresses} = fetchGithubSybil();
  for (let u of referrals) {
    const refereeAddress = u['Referee Address'];
    const campaignSlug = getCampaignSlug(u)
    const addressRes = getReferrerAddress(u, twitterToAddresses)
    let referrerAddress;
    if (addressRes.error) {
      continue;
    } else {
      referrerAddress = addressRes.address
    }
    try {
      const campaign = await prisma.campaign.findFirst({
        where: {
          slug: campaignSlug,
        },
      });
      const referee = await prisma.referee.create({
        data: {
          address: refereeAddress,
          referrerAddress: referrerAddress,
          campaignId: campaign.id,
        },
      });
      console.log(`Created referee with id: ${referee.id}`);
    } catch (e) {

    }
  }
}


const getReferrerAddress = (u: Referral, twitterToAddresses: TwitterToAddresses) => {
  const twitterOrAddressOrBad = u.UTM_CONTENT;
  let res = {
    error: undefined,
    address: undefined
  }
  let address: string | undefined;
  if (isEthereumAddress(twitterOrAddressOrBad)) {
    address = twitterOrAddressOrBad
  } else if (twitterToAddresses[twitterOrAddressOrBad] && isEthereumAddress(twitterToAddresses[twitterOrAddressOrBad][0])) {
    address = twitterToAddresses[twitterOrAddressOrBad][0]
  } else {
    res.error = true
    return res
  }
  res.address = address
  return res
}

const getCampaignSlug = (user: Referral) => {
  const campaignSlug = user.UTM_CAMPAIGN;
  const protocolSlug = user.UTM_SOURCE;
  return (protocolSlug + '-' + campaignSlug).toLowerCase()
}

