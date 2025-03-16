- 👋 Hi, I’m @Salo750
- 👀 I’m interested in ...
- 🌱 I’m currently learning ...
- 💞️ I’m looking to collaborate on ...
- 📫 How to reach me ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...

<!---
Salo750/Salo750 is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->

    z = c
    for n in range(max_iter):
        if abs(z) > 2:
            return n
        z = z*z + c
    return max_iter

def julia(z, c, max_iter):
    for n in range(max_iter):
        if abs(z) > 2:
            return n
        z = z*z + c
    return max_iter

def sierpinski(x, y, size, level):
    if level == 0:
        return
    x1, y1 = x + size/2, y + size/2
    sierpinski(x, y, size/2, level-1)
    sierpinski(x1, y, size/2, level-1)
    sierpinski(x, y1, size/2, level-1)

def generate_fractal(width, height, max_iter):
    fractal = np.zeros((height, width))
    for x in range(width):
        for y in range(height):
            c = complex(x/width*3.5-2.5, y/height*2-1)
            m = mandelbrot(c, max_iter)
            j = julia(c, complex(-0.8, 0.156), max_iter)
            sierpinski(x, y, width/100, 5)
            fractal[y, x] = (m + j) / 2
    return fractal


import matplotlib.pyplot as plt

def display_fractal(fractal):
    plt.imshow(fractal, cmap='hot')
    plt.show()

def handle_input(event):
    if event.key == 'up':
        max_iter += 10
    elif event.key == 'down':
        max_iter -= 10
    fractal = generate_fractal(width, height, max_iter)
    display_fractal(fractal)

width, height, max_iter = 800, 800, 100
fractal = generate_fractal(width, height, max_iter)
display_fractal(fractal)
plt.connect('key_press_event', handle_input)
