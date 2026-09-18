import re

svg = open('public/separator.svg').read()
path = re.search(r'd="([^"]+)"', svg).group(1)
pts = re.findall(r'([0-9.]+)', path)
xs = [float(pts[i]) for i in range(0, len(pts), 2)]
ys = [float(pts[i]) for i in range(1, len(pts), 2)]

min_x, max_x = min(xs), max(xs)
min_y, max_y = min(ys), max(ys)
print(f"viewBox=\"{min_x} {min_y} {max_x - min_x} {max_y - min_y}\"")
