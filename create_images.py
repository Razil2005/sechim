import base64
from io import BytesIO
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("PIL not available, creating basic HTML placeholders instead")
    import os
    
    # Create basic HTML image placeholders
    categories = {
        'countries': ['turkey', 'usa', 'germany', 'france', 'italy', 'spain', 'uk', 'japan', 'brazil', 'canada', 'australia', 'netherlands'],
        'movies': ['shawshank', 'godfather', 'dark-knight', 'pulp-fiction', 'forrest-gump', 'inception', 'matrix', 'interstellar', 'titanic', 'avatar', 'avengers-endgame', 'lion-king'],
        'books': ['mockingbird', '1984', 'pride-prejudice', 'great-gatsby', 'harry-potter', 'lotr', 'catcher-rye', 'got', 'hobbit', 'dune'],
        'football-players': ['messi', 'ronaldo', 'neymar', 'mbappe', 'haaland', 'debruyne', 'lewandowski', 'salah', 'mane', 'vandijk', 'modric', 'benzema'],
        'football-clubs': ['barcelona', 'real-madrid', 'man-united', 'man-city', 'liverpool', 'chelsea', 'arsenal', 'tottenham', 'bayern', 'psg', 'juventus', 'milan']
    }
    
    colors = ['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#2ecc71', '#e67e22', '#34495e', '#e91e63', '#f1c40f', '#95a5a6', '#1abc9c', '#ff7675']
    
    for category, items in categories.items():
        for i, item in enumerate(items):
            color = colors[i % len(colors)]
            svg_content = f'''<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="400" fill="{color}"/>
                <text x="200" y="200" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">{item.replace('-', ' ').title()}</text>
            </svg>'''
            
            # Save as SVG (which can be used as images)
            os.makedirs(f'images/{category}', exist_ok=True)
            with open(f'images/{category}/{item}.svg', 'w') as f:
                f.write(svg_content)
    
    print("Created SVG placeholder images for all categories")
