import { PrismaClient } from '@prisma/client';
import { resolve } from 'path';
import {
    fetchCSV,
} from '../../utils/csv';

interface EthscanTx {
    Txhash: string;
    Blockno: string;
    UnixTimestamp: string;
    DateTime: string;
    From: string;
    To: string;
    Token_ID: string;
    Method: string;
  }

export const seedBillidrop = async (prisma: PrismaClient) => {
    const txs = await fetchEthscanTx()
    await createPayouts(prisma, txs)
}

const fetchEthscanTx = async (): Promise<EthscanTx[]> => {
    const fileLocation = resolve(__dirname, './billidrop.csv');
    const ethscanTxHeaders = [
        'Txhash',
        'Blockno',
        'UnixTimestamp',
        'DateTime',
        'From',
        'To',
        'Token_ID',
        'Method'
    ];
    return fetchCSV<EthscanTx>(fileLocation, ethscanTxHeaders)
};

const createPayouts = async (prisma: PrismaClient, ethscanTxs: Array<EthscanTx>) => {
    const BILLIDROP_CAMPAIGN_SLUG = 'billidrop-billidrop'
    //todo: use AMP instead
    const cre8r = await prisma.token.create({
        data: {
            address: '0x2aD402655243203fcfa7dCB62F8A08cc2BA88ae0',
            chainId: 250,
            decimals: 18,
            name: 'CRE8R',
            symbol: 'CRE8R'
        }
    })

    const usdc = await prisma.token.create({
        data: {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            chainId: 1,
            decimals: 6,
            name: 'USDC',
            symbol: 'USDC'
        }
    })

    for (let e of ethscanTxs) {
        if (e.Method === 'Mint') {
            try {
                const minter = e.To
                const campaign = await prisma.campaign.findUnique({
                    where: {
                        slug: BILLIDROP_CAMPAIGN_SLUG
                    }
                })
                const referee = await prisma.referee.findFirst({
                    where: {
                        AND: {
                            address: minter,
                            campaignId: campaign.id
                        }
                    }
                })
                if (!referee) continue;
                const payoutReferee = await prisma.payout.create({
                    data: {
                        creation: new Date().toISOString(),
                        //todo: create enum for status
                        status: 'unclaimed',
                        userAddress: referee.address,
                        campaignId: campaign.id
                    }
                })
                await prisma.payoutToken.create({
                    data: {
                        tokenId: cre8r.id,
                        payoutId: payoutReferee.id,
                        amountUSD: 60
                    }
                })
                await prisma.payoutToken.create({
                    data: {
                        tokenId: usdc.id,
                        payoutId: payoutReferee.id,
                        amountNum: '60000000'
                    }
                })

                const payoutMinter = await prisma.payout.create({
                    data: {
                        // creation: new Date().toUTCString(),
                        //todo: create enum for status
                        status: 'unclaimed',
                        userAddress: minter,
                        campaignId: campaign.id
                    }
                })
                await prisma.payoutToken.create({
                    data: {
                        tokenId: cre8r.id,
                        payoutId: payoutMinter.id,
                        amountUSD: 60
                    }
                })
                console.log(`Successfully added created payment for ${minter} and ${referee.address}`)
            } catch (e) {
                console.log('Error adding payout: ', e)
            }

        }
    }
}
  