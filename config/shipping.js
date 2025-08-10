import * as shippo from 'shippo';

export class ShippingService {
    #shippo;
    #fromAddress;

    constructor(apiKey) {
        this.#shippo = shippo(apiKey);

        if (!this.#shippo) {
            throw new Error("Failed to initialize Shippo. Check API key.");
        }

        this.#fromAddress = {
            name: 'Queens Boujee Collections',
            street1: '3207 Laurel Hill Rd',
            city: 'Hanover',
            state: 'MD',
            zip: '21076',
            country: 'US',
            phone: '+12408872649',
            email: 'njilifac.queendoline@gmail.com'
        };
    }

    #calculateTotalWeight(cartItems) {
        const weights = {
            long_wigs: 1, 
            short_wigs: 0.9,
            bouncy_wigs: 1.2,
            bob_wigs: 0.8,
            pixie_wigs: 0.7,
            kinky_wigs: 1.1,
            accessories: 0.3,
            dresses: 0.5,
            rich_aunty: 0.6,  
            suit: 0.8,
            coat: 1, 
            dudu: 0.75,  
            default: 0.25  // Fallback weight for unknown categories
        };
        

        return cartItems.reduce((sum, item) => {
            if (!item.type || !item.quantity) {
                throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
            }
            const itemWeight = weights[item.type] ?? weights.default;
            return sum + (itemWeight * item.quantity);
        }, 0);
    }

    async getShippingRates(toAddress, cartItems) {
        try {
            // Create shipment
            const shipment = await this.#shippo.shipment.create({
                address_from: this.#fromAddress,
                address_to: toAddress,
                parcels: [{
                    length: 15,
                    width: 12,
                    height: 8,
                    distance_unit: 'in',
                    weight: Math.max(this.#calculateTotalWeight(cartItems), 0.1),
                    mass_unit: 'lb'
                }],
                async: false
            });
    
            // Get rates for the shipment
            const ratesList = shipment.rates;
    
            if (!ratesList?.length) {
                throw new Error('No shipping rates available');
            }
    
            // Filter only UPS rates
            const upsRates = ratesList
                .filter(rate => rate.provider.toLowerCase() === 'ups')
                .sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount)); // Sort by price (cheapest first)
    
            if (!upsRates.length) {
                throw new Error('No UPS shipping rates available');
            }
            console.log(upsRates)
    
            // Return only the shipping cost (exact amount as a number)
            return parseFloat(upsRates[0].amount); 
    
        } catch (error) {
            console.error('Shipping calculation error:', error);
            throw new Error(`Failed to calculate shipping: ${error.message}`);
        }
    }
    

    async getRatesInCurrency(shipmentId, currencyCode) {
        try {
            const rates = await this.#shippo.rates.list({
                shipment: shipmentId,
                currency: currencyCode
            });

            return rates.results;
        } catch (error) {
            console.error('Currency conversion error:', error);
            throw error;
        }
    }
}
