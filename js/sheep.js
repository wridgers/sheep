// sheep.js - js1k entry by Will Ridgers
// render iterative function system fractals!

// index of variables
/*
 * a = [global] canvas 2d context
 * b = [global] document.body
 * c = [global] canvas element
 * d = largest hit per pixel
 * e = colour coordinate
 * f = function chosen randomly
 * g = m[f]
 * h = [global] canvas height
 * i = iterator for loop
 * j = iterator for loop
 * k = z.data floats
 * l = index of pixal in image buffer
 * m = [global] matrix of coefficients
 * n = 
 * o = [global] array of functions
 * p = 
 * q = 
 * r = x*x + y*y
 * s = scale value
 * t = temp variable
 * u = scaled x coordinate
 * v = scaled y coordinate
 * w = [global] canvas width
 * x = x coordinate
 * y = y coordinate
 * z = [global] image buffer
 */ 

// index of functions, and aliases
/*
 * F = render a flame
 * R = random number [0-1]
 * M = Math
 * W = window
 */

// W=window;
M=Math;
W=window;

// setup canvas and window
w = c.width = W.innerWidth;
h = c.height = W.innerHeight;

// m = [
//     [0.562482, -0.539599, 0.397861, 0.501088, -0.42992, -0.112404],
//     [0.830039, 0.16248, -0.496174, 0.750468, 0.91022, 0.288389]
// ];

m = [
    [-R(), R(), -R(), R(), -R(), R()],
    [R(), -R(), R(), -R(), R(), -R()]
];

// colour palette
// 0: reddish
n = [
    [
        [0,  '[t*2.5,0,0]'],
        [.25,'[1,(t-.25)*2.5,0]'],
        [.50,'[1-((t-.5)*.4),1,0]'],
        [.75,'[1,1,(t-.75)*2]']
    ]
];

/*
 * Return a random number
 */
function R() { 
    return M.random();
}

/*
 * Render a flame to canvas
 */
function F() {

    // create image buffer
    z = a.createImageData(w,h);

    // random x,y in -1,1 plane
    // OPT: still works at (0,0)
    x = 0;
    y = 0;

    // track largest pixel hit
    d = 0;

    // a while loop is smaller than a for loop
    i = 0;
    while (i < 10000000) {

        // pic a function randomly
        g = m[M.floor(R()*m.length)];

        // linear equations
        t = g[0] * x + g[1] * y + g[4];
        y = g[2] * x + g[3] * y + g[5];
        x = t;

        // variables for variations
        r = (x*x + y*y);

        // spherical
        x = x/(r);
        y = y/(r);

        // scale x and y coordinates to fit in z
        u = M.round(x*(w/2) + (w/2), 0);
        v = M.round(y*(h/2) + (h/2), 0);

        // calculate location of pixel in image buffer
        l = 4*(u*w + v);

        // only if it's actually inside the array...
        if (0 <= l < 4*w*h) {
            // add hit to alpha
            z.data[l+3] += 1;

            // keep largest hit
            if (z.data[l+3] > d)
                d = z.data[l+3];
        }

        // increase i
        i++;
    }

    // prepare image buffer
    i = 0;
    while ( i < 4*w*h ) {
        // logarithmic scale
        t = (M.log(z.data[i+3])/M.log(d));

        if (t > 0) {

            for (j in n[0])
                if (t > n[0][j][0])
                    q = eval(n[0][j][1]);

            // set nicely!
            z.data[i+0] = 255*q[0];
            z.data[i+1] = 255*q[1];
            z.data[i+2] = 255*q[2];

        }

        // set alpha to full
        z.data[i+3] = 255;

        i+=4;
    }
    
    // copy buffer to canvas
    a.putImageData(z, 0, 0);
}

// render flame
F();

