require("dotenv").config()
import puppeteer from "puppeteer"
import { ScrapedProduct, ScrapedProductSite } from "./types/db"
import { DAO } from "./lib/dao"
import { Option } from "./types/option"
import jsdom from "jsdom"
import { ProductType } from "./types/producttypes"
const { JSDOM } = jsdom

async function scrapeItem(item: Element, productType: ProductType) {
    const title = item.querySelector("p[data-component='ProductCardBrandName']")?.textContent
    const url = "https://www.farfetch.com" + item.querySelector("a")?.href?.split("?")[0]
    const price = item.querySelector("p[data-component='Price']")?.textContent?.replace("$","")?.replace(",","")
    const image = item.querySelector("img[data-component='ProductCardImagePrimary']")?.getAttribute("src")
    
    if(!title || !url || !price || !image) {
        console.log("Missing data for product")
        return
    }

    const product: ScrapedProduct = {
        title,
        url,
        price: parseFloat(price),
        image,
        description: "",
        site: ScrapedProductSite.FARFETCH,
        product_type: productType
    }

    await DAO.storeProduct(product)
}

function getNextPageUrl(document: Document): string | null {
    const nextButton = document.querySelector("a[data-testid='page-next']")
    if(!nextButton) return null

    return nextButton.getAttribute("href")
}

async function scrapePage(url: string, productType: ProductType): Promise<Option<string>> {
    const browser = await puppeteer.launch({headless: 'new'})
    const page = await browser.newPage()

    await page.goto(url)
    await page.setViewport({width: 1080, height: 1024})

    console.log("Scrolling to bottom of page...")
    await page.evaluate(() => {
        let scroll_location = 0
        const scrollHeight = document.body.scrollHeight

        return new Promise<void>((resolve, reject) => {
            const scrollInterval = setInterval(() => {
                const scroll_amount = 200
                window.scrollBy(0, scroll_amount)
                scroll_location += scroll_amount
                if(scroll_location >= scrollHeight - scroll_amount) {
                    clearInterval(scrollInterval)
                    resolve()
                }
            }, 250)
        })
    })

    console.log("Scraping product data...")

    const data = await page.content()
    const dom = new JSDOM(data)
    const document = dom.window.document

    const itemList = document.querySelector("ul[data-testid='product-card-list']")
    if(!itemList) throw new Error("No items found")

    const items = itemList.children

    for(let item of items) {
        await scrapeItem(item, productType)
    }

    console.log("Finished scraping product data from page")

    const nextPageUrl = getNextPageUrl(document)

    console.log("Next page url is " + url + nextPageUrl)

    await page.close()
    await browser.close()

    if(nextPageUrl) {
        return new Option<string>(url + nextPageUrl)
    } else {
        return new Option<string>()
    }
}

async function scrapeAllPages(url: string, productType: ProductType) {
    let nextPageUrl = new Option<string>(url)

    while(nextPageUrl.hasValue()) {
        console.log("Accessing next page...")
        nextPageUrl = await scrapePage(nextPageUrl.value!, productType)
    }
}

//scrapeAllPages("https://www.farfetch.com/shopping/men/shoes-2/items.aspx", ProductType.SHOE)
scrapeAllPages("https://www.farfetch.com/shopping/men/shirts-2/items.aspx", ProductType.SHIRT)