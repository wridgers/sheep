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
 * H = [global] histogram
 *
 * i = iterator for loop
 * j = iterator for loop
 * k = iterator for loop
 *
 * l = index of pixel in image buffer
 *
 * m = [global] matrix of coefficients
 * n = [global] array of palettes
 * N = [global] palette that has been chosen
 * o = [global] array of functions
 *
 * p = 
 * q = 
 * r = 
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

// TODO list:
// * display render progress
// * implement Drake's colouring method
// * better palettes
// * render a good flame by default

M=Math;
W=window;

// setup canvas and window
w = c.width  = W.innerWidth;
h = c.height = W.innerHeight;

// anti-aliasing
// NOTE: this doesn't seem to improve the quality of the render
// a huge amount, and this substantially reduces render time, so
// I have decided to remove it.
// c.style.width = w/2 + 'px';

// m = [
//     [0.562482, -0.539599, 0.397861, 0.501088, -0.42992, -0.112404],
//     [0.830039, 0.16248, -0.496174, 0.750468, 0.91022, 0.288389]
// ];

m = [
    [.5, -.5, R(), .5, -.4, -.1],
    [.8, R(), .1, -.5, R(), .2]
];

// colour palette
// 0: inferno
// 1: lagoon
// OPT: precompute a random palette
n = [
    [
        [0,  '[t*2.5,0,0]'],
        [.25,'[1,(t-.25)*2.5,0]'],
        [.50,'[1-((t-.5)*.4),1,0]'],
        [.75,'[1,1,(t-.75)*2]']
    ],
    [
        [0,  '[0,t*.5,0]'],
        [.25,'[0,.5,(t-.25)*.1]'],
        [.50,'[0,1-((t-.5)*.2),1]'],
        [.75,'[(t-.75)*2,1,1]']
    ]
];

// random palette
// OPT: change n.length to final n size
// OPT: precompute palette leaves no need for this
N = n[M.floor(R()*n.length)];

// functions
// OPT: remove the ones we don't use
// OPT: move this to main loop for speed?
// o = [
//     '[x,y]', // identity
//     '[M.sin(x),M.sin(y)]', // sinusoidal
//     '[x/r2,y/r2]', // spherical
//     '[x*M.sin(r2)-y*M.cos(r2),x*M.cos(r2)+y*M.sin(r2)]', // swirl
//     '[((x-y)*(x+y)/r),(2*x*y)/r]', // horseshoe
//     '[T/M.PI,r-1]', // polar
//     '[r*M.sin(T+r),r*M.cos(T-r)]' // handkerchief
// ];

// histogram, array of hits
H = new Array(w*h);

// init. point in x,y plane
x = 0;
y = 0;

// track largest pixel hit
d = 0;

/*
 * Return a random number
 */
function R() { 
    return M.random();
}

/*
 * Render a flame to canvas
 */
function F(I) {

    // a while loop is smaller than a for loop
    i = 0;
    while (i < I) {

        // pic a function randomly
        g = m[M.floor(R()*m.length)];

        // linear equations
        t = g[0] * x + g[1] * y + g[4];
        y = g[2] * x + g[3] * y + g[5];
        x = t;

        // variables for variations
        // OPT: remove the ones we don't use
        r2 = (x*x + y*y);
        // r  = M.sqrt(r2);
        // T  = M.atan(x/y);
        // P  = M.atan(y/x);

        // t = eval(o[2])[0];
        // y = eval(o[2])[1];
        // x = t;

        t = x/r2;
        y = y/r2;
        x = t;

        // scale x and y coordinates to fit in z
        u = M.round(x*(w/2) + (w/2), 0);
        v = M.round(y*(h/2) + (h/2), 0);

        // calculate location of pixel in image buffer
        l = u*w + v;

        // add hit to histogram
        H[l]++;

        // keep largest hit
        if (H[l] > d)
            d = H[l];

        // increase i
        i++;
    }

    // draw to canvas
    D();
}

/*
 * Draw the flame based on histogram data
 * Warning: only compatible with logarithmic colouring, not Drake's method.
 */
function D() {

    // create image buffer
    z = a.createImageData(w,h);

    // prepare image buffer
    i = 0;
    while (i < w*h) {
        // logarithmic scale
        t = (M.log(H[i])/M.log(d));

        // OPT: removing this if statement would be nice.

        if (t > 0) {
            // eval palette functions
            // OPT: precompute random palette
            // SPEED: is eval really slow?
            for (j in N)
                if (t > N[j][0])
                    q = eval(N[j][1]);

            // set nicely!
            z.data[4*i]   = 255*q[0];
            z.data[4*i+1] = 255*q[1];
            z.data[4*i+2] = 255*q[2];
        }

        // set alpha to full
        z.data[4*i+3] = 255;

        // next quad
        i++;
    }
    
    // copy buffer to canvas
    a.putImageData(z, 0, 0);

    // do it again!
    W.setTimeout(F, 10, 50000);
}

// OPT: I want this to be a for (i in H) kind of loop
for (var i = 0; i < H.length; i++)
    H[i] = 0;

// render flame
// setting a timeout stops the browser from spending ages loading
W.setTimeout(F, 10, 50000);
