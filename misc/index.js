const recombee = require("recombee-api-client")
const { createClient } = require("@supabase/supabase-js")
const { v4: uuidv4 } = require('uuid');

const rqs = recombee.requests;
const client = new recombee.ApiClient("refine-app-prod", "UMsMXDZuSfZeQNdf2uNNv97vgikRSbLDct1ZhKD5YAtfdUhHohmfklVtvjYkPDTA", {region: "ca-east"})
const supabase = createClient("https://ctftxukxcbhtpjfxdsjf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZnR4dWt4Y2JodHBqZnhkc2pmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MDU0ODIwMSwiZXhwIjoyMDA2MTI0MjAxfQ.6um61xIP2kzM4K4n1-574U7C_THi7sxegemmzEAXUew")

async function deleteUserByRecombeeId(recombee_id) {
    const request = new rqs.DeleteUser(recombee_id);
    const res = await client.send(request);
}

//Use responsibly.
async function deleteAllRecombeeUsers() {
    const request = new rqs.ListUsers()
    const res = await client.send(request);
    res.forEach(async id => {
        await deleteUserByRecombeeId(id)
    })
}

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

async function cleanUpRecombeeProducts() {
    const request = new rqs.ListItems()
    const res = await client.send(request);
    const product_ids = (await supabase.from("scraped-products").select("recombee_id")).data.map(a => a.recombee_id)

    const batch_size = 20

    let i = 0

    while(i < res.length) {
        const batch = res.slice(i, i + batch_size)
        let queuedForDeletion = []

        for(let id of batch) {
            if(!product_ids.includes(id)) {
                queuedForDeletion.push(id)
            }
        }

        queuedForDeletion.forEach(async id => {
            await client.send(new rqs.DeleteItem(id))
            console.log("Deleted " + id)
        })

        i += batch_size
    }
}

async function setUserFavoriteColors(userId, favoriteColors) {
    const request = new rqs.SetUserValues(userId,
        {
            favorite_colors: favoriteColors,
        });
    const res = await client.send(request);
}

async function setShoeDefaultProductType() {
    const supabaseShoes = await supabase.from("scraped-products").select("recombee_id").eq("product_type", "shoe")
    for(let product of supabaseShoes.data) {
        console.log(product)
        const request = new rqs.SetItemValues(product.recombee_id,
            {
                productType: "shoe",
            });
        const res = await client.send(request);
    }
}

setShoeDefaultProductType()

//setUserFavoriteColors("56c6f389-c40d-496e-9db9-e08a84d182c5", ["#3297a8", "#ffffff"])

//cleanUpRecombeeProducts()

//migrateAllProductsToRecombee()

async function delayMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}