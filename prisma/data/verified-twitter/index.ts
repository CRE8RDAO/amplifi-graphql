import { isEthereumAddress } from 'class-validator'
import verified from './verified'

interface AddressToTwitter {
    [address : string]: string
}

export interface TwitterToAddresses {
    [twitterHandle : string]: string
}

export const fetchGithubSybil = () : {addressToTwitter: AddressToTwitter, twitterToAddresses: TwitterToAddresses} => {
    const res = {
        addressToTwitter: {},
        twitterToAddresses: {}
    }
    const addresses = Object.keys(verified)
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        if (!verified[address].twitter || !isEthereumAddress(address)) {
            continue;
        } 
        const twitter = verified[address].twitter.handle
        res.addressToTwitter[address] = twitter
        if (res.twitterToAddresses[twitter] == undefined) {
            res.twitterToAddresses[twitter] = [address]
        } else {
            res.twitterToAddresses[twitter].push(address)
        }
    }
    return res
}