#!/usr/bin/env python3
"""
Script to create placeholder images for the Beautiful Women category.
Creates 48 placeholder images with names and attractive gradient backgrounds.
"""

import os
from PIL import Image, ImageDraw, ImageFont
import random

# Beautiful women names from the data.js file
names = [
    "Emma Watson", "Scarlett Johansson", "Gal Gadot", "Margot Robbie", 
    "Jennifer Lawrence", "Angelina Jolie", "Charlize Theron", "Natalie Portman",
    "Anne Hathaway", "Emma Stone", "Blake Lively", "Mila Kunis",
    "Jessica Alba", "Megan Fox", "Keira Knightley", "Rachel McAdams",
    "Zendaya", "Taylor Swift", "Ariana Grande", "Selena Gomez",
    "Bella Hadid", "Gigi Hadid", "Kendall Jenner", "Hailey Bieber",
    "Emily Ratajkowski", "Adriana Lima", "Candice Swanepoel", "Miranda Kerr",
    "Karlie Kloss", "Rosie Huntington", "Irina Shayk", "Dua Lipa",
    "Rihanna", "Beyoncé", "Jennifer Lopez", "Priyanka Chopra",
    "Deepika Padukone", "Aishwarya Rai", "Freida Pinto", "Lupita Nyongo",
    "Zoe Saldana", "Thandie Newton", "Halle Berry", "Monica Bellucci",
    "Penelope Cruz", "Salma Hayek", "Fan Bingbing", "Liu Yifei"
]

# Beautiful gradient color schemes
color_schemes = [
    [(255, 182, 193), (255, 105, 180)],  # Pink gradient
    [(255, 192, 203), (255, 20, 147)],   # Hot pink gradient
    [(221, 160, 221), (186, 85, 211)],   # Plum gradient
    [(230, 230, 250), (138, 43, 226)],   # Lavender gradient
    [(255, 218, 185), (255, 160, 122)],  # Peach gradient
    [(255, 228, 225), (255, 182, 193)],  # Misty rose gradient
    [(240, 248, 255), (173, 216, 230)],  # Alice blue gradient
    [(255, 240, 245), (255, 192, 203)],  # Lavender blush gradient
]

def create_gradient_image(width, height, color1, color2):
    """Create a vertical gradient image"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return image

def create_placeholder_image(name, filename, width=400, height=400):
    """Create a placeholder image with name and beautiful gradient"""
    # Choose a random color scheme
    colors = random.choice(color_schemes)
    
    # Create gradient background
    image = create_gradient_image(width, height, colors[0], colors[1])
    draw = ImageDraw.Draw(image)
    
    # Try to use a nice font, fall back to default if not available
    try:
        # Try different font sizes
        font_size = 40
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font_size = 40
            font = ImageFont.truetype("Arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
    
    # Add decorative elements
    # Add some sparkle/star decorations
    for _ in range(8):
        x = random.randint(20, width - 20)
        y = random.randint(20, height // 3)
        size = random.randint(3, 8)
        star_color = (255, 255, 255, 180)
        # Draw a simple star shape
        draw.ellipse([x-size, y-size, x+size, y+size], fill=(255, 255, 255))
    
    # Add the name text
    text = name
    
    # Get text dimensions
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (width - text_width) // 2
    y = height - text_height - 30
    
    # Add text shadow
    shadow_offset = 2
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=(0, 0, 0, 100))
    
    # Add main text
    draw.text((x, y), text, font=font, fill=(255, 255, 255))
    
    # Add a decorative border
    border_color = (255, 255, 255, 150)
    draw.rectangle([2, 2, width-3, height-3], outline=border_color, width=3)
    
    return image

def main():
    """Main function to create all placeholder images"""
    # Create the directory if it doesn't exist
    output_dir = "images/beautiful-women"
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Creating {len(names)} placeholder images for Beautiful Women category...")
    
    for i, name in enumerate(names, 1):
        # Create filename from name (convert to lowercase, replace spaces with hyphens)
        filename = name.lower().replace(' ', '-') + '.jpg'
        filepath = os.path.join(output_dir, filename)
        
        # Create the placeholder image
        image = create_placeholder_image(name, filename)
        
        # Save the image
        image.save(filepath, 'JPEG', quality=85)
        print(f"Created {i}/48: {filepath}")
    
    print("All placeholder images created successfully!")
    print(f"Images saved in: {os.path.abspath(output_dir)}")

if __name__ == "__main__":
    main()
