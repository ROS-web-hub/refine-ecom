const recombee = require("recombee-api-client")
const { createClient } = require("@supabase/supabase-js")
const { v4: uuidv4 } = require('uuid');

const rqs = recombee.requests;
const client = new recombee.ApiClient("refine-app-prod", "UMsMXDZuSfZeQNdf2uNNv97vgikRSbLDct1ZhKD5YAtfdUhHohmfklVtvjYkPDTA", {region: "ca-east"})
const supabase = createClient("https://ctftxukxcbhtpjfxdsjf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZnR4dWt4Y2JodHBqZnhkc2pmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MDU0ODIwMSwiZXhwIjoyMDA2MTI0MjAxfQ.6um61xIP2kzM4K4n1-574U7C_THi7sxegemmzEAXUew")

async function getAllUnmigratedProductsFromSupabase() {
    const res = await supabase
        .from('scraped-products')
        .select('*')
        .is("recombee_id", null)

    return res.data
}

async function migrateAllProductsToRecombee() {
    const products = await getAllUnmigratedProductsFromSupabase()
    let productsMigrated = 0

    for(let product of products) {
        const recombee_id = uuidv4()
        console.log(product)
        const palate = product.color_palate
        const validJson = palate.replace(/'/g, '"');
        const parsedPalate = JSON.parse(validJson);

        const hexPalate = parsedPalate.map(rgb => {
            return "#" + rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16)
        })

        const request = new rqs.SetItemValues(recombee_id,
            {
                supabase_id: product.id,
                colors: hexPalate,
                productType: product.product_type,
            },
            {
                cascadeCreate: true
            });
        const res = await client.send(request);
        productsMigrated++
        console.log(productsMigrated)
        console.log("Product ID: " + product.id)
        const supabaseRes = await supabase.from("scraped-products").update({ recombee_id }).eq("id", product.id)
        console.log(supabaseRes)
    }
}

migrateAllProductsToRecombee()