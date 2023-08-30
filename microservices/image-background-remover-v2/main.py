import os
import requests
from PIL import Image
from colorthief import ColorThief
from rembg import remove
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
bucket_name = "product-images"
def autocrop_image(image_url, border=0):
    image = Image.open(image_url)

    # Get the bounding box
    bbox = image.getbbox()

    # Crop the image to the contents of the bounding box
    image = image.crop(bbox)

    # Determine the width and height of the cropped image
    (width, height) = image.size

    # Add border
    width += border * 2
    height += border * 2

    # Create a new image object for the output image
    cropped_image = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    # Paste the cropped image onto the new image
    cropped_image.paste(image, (border, border))

    image.save(image_url)


supabase: Client = create_client(url, key)

'''
supabase.table("scraped-products").update({
        "processed": False,
}).gte("id", 0).execute()
'''

data = supabase.table("scraped-products").select("*").eq("processed", False).execute().data
#data = supabase.table("scraped-products").select("*").gte("id", 0).execute().data

for product in data:
    output_path = "rmbg_temp.png"

    # Download the image from the URL
    print("Downloading image for product " + str(product["id"]))
    response = requests.get(product["image"])
    image_data = response.content

    # Remove the background from the image and save again
    with open(output_path, 'wb') as o:
        print("Removing background")
        output = remove(image_data)
        print("Saving file")
        o.write(output)

    with open(output_path, 'rb') as o:
        print("Generating product color palate")
        color_thief = ColorThief(o)
        color_palate = color_thief.get_palette(quality=1)

    print(color_palate)

    print("Cropping file")
    autocrop_image(output_path)

    already_exists = False

    try:
        print("Uploading to bucket")
        crop_img_path = "/" + str(product["id"]) + ".png"
        supabase.storage.from_(bucket_name).upload(crop_img_path, output_path)
        supabase_img_url = supabase.storage.from_(bucket_name).get_public_url(crop_img_path)
    except:
        print("File already exists")
        already_exists = True


    try:
        with open("img-copy.png", 'wb') as o:
            o.write(image_data)
        copy_img_path = "/" + str(product["id"]) + "-copy" + ".png"
        supabase.storage.from_(bucket_name).upload(copy_img_path, "img-copy.png")
        copy_img_url = supabase.storage.from_(bucket_name).get_public_url(copy_img_path)
    except:
        print("File already exists")
        already_exists = True

    print("Updating db")

    if already_exists:
        supabase.table("scraped-products").update({
            "processed": True,
            "color_palate": color_palate
        }).eq("id", product["id"]).execute()
    else:
        supabase.table("scraped-products").update({
            "processed": True,
            "processed_img": supabase_img_url,
            "copy_img_url": copy_img_url,
            "color_palate": color_palate
        }).eq("id", product["id"]).execute()


