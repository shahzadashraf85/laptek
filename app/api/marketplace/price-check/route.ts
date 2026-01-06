import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/marketplace/price-check
 * Fetches competitive pricing from Walmart Canada and Best Buy Canada
 */
export async function POST(request: NextRequest) {
    try {
        const { query, category, brand } = await request.json();

        if (!query) {
            return NextResponse.json(
                { success: false, error: 'Search query is required' },
                { status: 400 }
            );
        }

        console.log(`[Price Check] Query: "${query}", Category: ${category}, Brand: ${brand}`);

        // Initialize results
        const results: any = {
            success: true,
            walmart: null,
            bestbuy: null,
            demand: 'Medium'
        };

        // Fetch from Walmart Canada
        try {
            const walmartPrice = await fetchWalmartPrice(query);
            if (walmartPrice) {
                results.walmart = {
                    price: walmartPrice,
                    url: `https://www.walmart.ca/search?q=${encodeURIComponent(query)}`
                };
            }
        } catch (error) {
            console.error('[Walmart] Fetch error:', error);
        }

        // Fetch from Best Buy Canada
        try {
            const bestbuyPrice = await fetchBestBuyPrice(query);
            if (bestbuyPrice) {
                results.bestbuy = {
                    price: bestbuyPrice,
                    url: `https://www.bestbuy.ca/en-ca/search?search=${encodeURIComponent(query)}`
                };
            }
        } catch (error) {
            console.error('[Best Buy] Fetch error:', error);
        }

        // If no results found
        if (!results.walmart && !results.bestbuy) {
            return NextResponse.json({
                success: false,
                error: 'No pricing data found from Walmart or Best Buy Canada. Try a more specific product name.'
            });
        }

        return NextResponse.json(results);

    } catch (error: any) {
        console.error('[Price Check API] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Fetch price from Walmart Canada
 * Uses Walmart's search API or web scraping
 */
async function fetchWalmartPrice(query: string): Promise<number | null> {
    try {
        // Option 1: Use Walmart API (if you have API access)
        // const apiUrl = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?query=${encodeURIComponent(query)}`;

        // Option 2: Web scraping (basic example - may need adjustment based on Walmart's current structure)
        const searchUrl = `https://www.walmart.ca/search?q=${encodeURIComponent(query)}`;

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Walmart fetch failed: ${response.status}`);
        }

        const html = await response.text();

        // Extract price from HTML (this is a simplified example)
        // Walmart's actual structure may vary - you might need to use a proper HTML parser
        const priceMatch = html.match(/"price":\s*"?\$?(\d+\.?\d*)"/i) ||
            html.match(/\$(\d+\.?\d*)/);

        if (priceMatch && priceMatch[1]) {
            const price = parseFloat(priceMatch[1]);
            console.log(`[Walmart] Found price: $${price}`);
            return price;
        }

        // Fallback: Return null if no price found
        console.log('[Walmart] No price found in response');
        return null;

    } catch (error) {
        console.error('[Walmart] Error:', error);
        return null;
    }
}

/**
 * Fetch price from Best Buy Canada
 */
async function fetchBestBuyPrice(query: string): Promise<number | null> {
    try {
        // Option 1: Use Best Buy API (requires API key from developer.bestbuy.com)
        // const apiKey = process.env.BESTBUY_API_KEY;
        // const apiUrl = `https://api.bestbuy.com/v1/products((search=${encodeURIComponent(query)}))?apiKey=${apiKey}&format=json`;

        // Option 2: Web scraping
        const searchUrl = `https://www.bestbuy.ca/api/v2/json/search?query=${encodeURIComponent(query)}&lang=en-CA`;

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Best Buy fetch failed: ${response.status}`);
        }

        const data = await response.json();

        // Extract price from Best Buy API response
        if (data.products && data.products.length > 0) {
            const firstProduct = data.products[0];
            const price = firstProduct.salePrice || firstProduct.regularPrice;

            if (price) {
                console.log(`[Best Buy] Found price: $${price}`);
                return parseFloat(price);
            }
        }

        console.log('[Best Buy] No price found in response');
        return null;

    } catch (error) {
        console.error('[Best Buy] Error:', error);
        return null;
    }
}
