// Do Browsers Dream of Electric Sheep?
// js1k entry by Will Ridgers

/*
 * Special thanks to Scott Draves for his amazing work on the fractal flame
 * algorithm and the electric sheep wallpaper. 
 */

/* index of variables
 *
 * a = [global] canvas 2d context
 * A = random var
 * b = [global] document.body
 * B = random var
 * c = [global] canvas element
 * C = random var
 *
 * d = largest hit per pixel
 * e = colour coordinate
 * f = function chosen randomly
 * F = render a flame
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
 * M = Math
 * n = [global] array of palettes
 * N = [global] palette that has been chosen
 * o = [global] array of functions
 * O = [global] array of trig functions
 *
 * p = 
 * P = M.floor
 * q = 
 * r = 
 * R = Math.random
 * s = scale value
 * t = temp variable
 * T = M.round
 * u = scaled x coordinate
 * v = scaled y coordinate
 * w = [global] canvas width
 * W = window
 * x = x coordinate
 * y = y coordinate
 * z = [global] image buffer
 */ 

/* TODO list:
 *
 * manual control over focal point and zoom
 * render a good flame by default
 * stop iterating when a good result is acheived
 */

/* Extra space?
 *
 * more advanced fractals
 * save as image button
 * edit/share fractals
 * track and share seeds?
 */

// open a new window with canvas as png, for saving
// W.open(c.toDataURL('image/png'));

// very useful aliases
M=Math;
W=window;

R=M.random; // saves a lot of bytes!
P=M.floor;  // saves four bytes!

// setup canvas and window
w = c.width  = W.innerWidth;
h = c.height = W.innerHeight;

// anti-aliasing
// c.style.width = w/2 + 'px';

// flame coefficients
// m = [
//     [0.562482, -0.539599, 0.397861, 0.501088, -0.42992, -0.112404],
//     [0.830039, 0.16248, -0.496174, 0.750468, 0.91022, 0.288389]
// ];

m = [
    [.5, -.5, R(), .5, -.4, -.1],
    [.8, R(), .1, -.5, R(), .2]
];

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

// colour palette
n = new Array(256);

// OPT: use m instead?
// random values for colour palette computing
A = R();
B = R();
C = R();

// array of trig shuffled trig functions
O = [M.tan,M.sin,M.cos].sort(function(){return .5 - R() });

// precompute palette
i = 256;
while(i--) {
    j=i/256;
    n[i] = [
        O[0](j)*i*(A+.3), 
        O[1](j)*i*(B+.3), 
        O[2](j)*i*(C+.3) 
    ];
}

// histogram, array of hits
H = new Array(w*h);

// init. point in x,y plane
x = 0;
y = 0;

// track largest pixel hit
d = 0;

/*
 * Render a flame to canvas
 */
function F() {

    // a while loop is smaller than a for loop
    i = 50000;
    while (i--) {

        // pic a function randomly
        g = m[P(R()*m.length)];

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

        u = P(x*(w/5) + (w/5));
        v = P(y*(h/5) + (h));

        // calculate location of pixel in image buffer
        l = u*w + v;

        // if undefined, then make zero
        // this negates the need for a loop to zero the array
        if (H[l] == undefined) 
            H[l] = 0;

        // add hit to histogram
        H[l]++;

        // keep largest hit
        if (H[l] > d)
            d = H[l];
    }

    // draw to canvas
    D();
}

/*
 * Draw the flame based on histogram data
 */
function D() {

    // create image buffer
    z = a.createImageData(w,h);

    // prepare image buffer
    i = w*h;
    while (i--) {
        // logarithmic scale
        t = (M.log(H[i])/M.log(d));

        // OPT: removing this if statement would be nice.
        if (t > 0) {
            // get colour triple from palette
            q = n[P(255*t)]; 

            // set nicely!
            z.data[4*i]   = q[0]; // red
            z.data[4*i+1] = q[1]; // green
            z.data[4*i+2] = q[2]; // blue
        }

        // set alpha to full
        z.data[4*i+3] = 255;
    }
    
    // copy buffer to canvas
    a.putImageData(z, 0, 0);

    // iterate again
    W.setTimeout(F, 10);
}

// render flame
// setting a timeout stops the browser from spending ages loading
W.setTimeout(F, 10);
