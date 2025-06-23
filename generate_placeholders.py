from PIL import Image, ImageDraw, ImageFont
import os

# Create placeholder images for all categories
categories = {
    'universities': [
        'harvard', 'mit', 'stanford', 'oxford', 'cambridge', 'eth', 'tokyo', 'sorbonne',
        'tum', 'imperial', 'yale', 'princeton', 'berkeley', 'columbia', 'penn', 'caltech'
    ],
    'cities': [
        'paris', 'newyork', 'london', 'tokyo', 'rome', 'barcelona', 'dubai', 'sydney',
        'sanfrancisco', 'amsterdam', 'prague', 'vienna', 'istanbul', 'singapore', 'losangeles', 'berlin'
    ],
    'animals': [
        'lion', 'tiger', 'elephant', 'giraffe', 'panda', 'wolf', 'eagle', 'dolphin',
        'penguin', 'koala', 'cheetah', 'polarbear', 'kangaroo', 'zebra', 'gorilla', 'fox'
    ],
    'cars': [
        'ferrari', 'lamborghini', 'porsche', 'bmw', 'mercedes', 'audi', 'tesla', 'mclaren',
        'bugatti', 'rollsroyce', 'bentley', 'astonmartin', 'maserati', 'jaguar', 'rangerover', 'koenigsegg'
    ],
    'games': [
        'witcher3', 'gtav', 'rdr2', 'minecraft', 'fortnite', 'cod', 'fifa', 'cyberpunk',
        'godofwar', 'lastofus', 'cs2', 'lol', 'valorant', 'amongus', 'apex', 'eldenring'
    ],
    'food': [
        'pizza', 'burger', 'sushi', 'pasta', 'tacos', 'ramen', 'steak', 'icecream',
        'chocolate', 'shawarma', 'kebab', 'biryani', 'fishandchips', 'croissant', 'pancakes', 'donuts'
    ],
    'programming-languages': [
        'javascript', 'python', 'java', 'cpp', 'csharp', 'typescript', 'go', 'rust',
        'swift', 'kotlin', 'php', 'ruby', 'c', 'html', 'sql', 'dart'
    ]
}

# Color schemes for different categories
color_schemes = {
    'universities': [(25, 25, 112), (255, 215, 0)],  # Navy blue and gold
    'cities': [(70, 130, 180), (255, 255, 255)],     # Steel blue and white
    'animals': [(34, 139, 34), (255, 255, 255)],     # Forest green and white
    'cars': [(220, 20, 60), (255, 255, 255)],        # Crimson and white
    'games': [(138, 43, 226), (255, 255, 255)],      # Blue violet and white
    'food': [(255, 140, 0), (255, 255, 255)],        # Dark orange and white
    'programming-languages': [(72, 61, 139), (255, 255, 255)]  # Dark slate blue and white
}

def create_placeholder_image(category, filename, text):
    # Create image
    img = Image.new('RGB', (400, 300), color=color_schemes[category][0])
    draw = ImageDraw.Draw(img)
    
    try:
        # Try to use a better font
        font = ImageFont.truetype("arial.ttf", 36)
        small_font = ImageFont.truetype("arial.ttf", 24)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Get text size and position
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (400 - text_width) // 2
    y = (300 - text_height) // 2
    
    # Draw text
    draw.text((x, y), text, fill=color_schemes[category][1], font=font)
    
    # Add category label at bottom
    category_label = category.replace('-', ' ').title()
    bbox_cat = draw.textbbox((0, 0), category_label, font=small_font)
    cat_width = bbox_cat[2] - bbox_cat[0]
    cat_x = (400 - cat_width) // 2
    draw.text((cat_x, 260), category_label, fill=color_schemes[category][1], font=small_font)
    
    # Save image
    directory = f"c:\\Users\\Razil\\Desktop\\secim\\images\\{category}"
    filepath = f"{directory}\\{filename}.jpg"
    img.save(filepath, "JPEG", quality=85)
    print(f"Created: {filepath}")

# Create all placeholder images
for category, filenames in categories.items():
    for filename in filenames:
        # Convert filename to display text
        text = filename.replace('_', ' ').title()
        if filename == 'cpp':
            text = 'C++'
        elif filename == 'csharp':
            text = 'C#'
        elif filename == 'html':
            text = 'HTML/CSS'
        elif filename == 'newyork':
            text = 'New York'
        elif filename == 'sanfrancisco':
            text = 'San Francisco'
        elif filename == 'losangeles':
            text = 'Los Angeles'
        elif filename == 'polarbear':
            text = 'Polar Bear'
        elif filename == 'rollsroyce':
            text = 'Rolls-Royce'
        elif filename == 'astonmartin':
            text = 'Aston Martin'
        elif filename == 'rangerover':
            text = 'Range Rover'
        elif filename == 'icecream':
            text = 'Ice Cream'
        elif filename == 'fishandchips':
            text = 'Fish & Chips'
        elif filename == 'witcher3':
            text = 'The Witcher 3'
        elif filename == 'gtav':
            text = 'GTA V'
        elif filename == 'rdr2':
            text = 'RDR 2'
        elif filename == 'godofwar':
            text = 'God of War'
        elif filename == 'lastofus':
            text = 'The Last of Us'
        elif filename == 'amongus':
            text = 'Among Us'
        elif filename == 'eldenring':
            text = 'Elden Ring'
        
        create_placeholder_image(category, filename, text)

print("All placeholder images created successfully!")
