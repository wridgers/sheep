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
 * d = largest hit per pixel
 * e = colour coordinate
 * f = function chosen randomly
 * F = render a flame
 * g = m[f]
 * h = [global] canvas height
 * H = [global] histogram
 * i = iterator for loop
 * j = iterator for loop
 * k = iterator for loop
 * l = index of pixel in image buffer
 * m = [global] matrix of coefficients
 * M = Math
 * n = [global] array of palettes
 * N = [global] palette that has been chosen
 * o = [global] array of functions
 * O = [global] array of trig functions
 * p = [global] count of how many F() calls
 * q = 
 * r = 
 * R = Math.random
 * s = scale value
 * t = temp variable
 * u = scaled x coordinate
 * v = scaled y coordinate
 * w = [global] canvas width
 * W = window, window.setTimeout
 * x = x coordinate
 * y = y coordinate
 * z = [global] image buffer
 * Z = z.data
 */ 

/* TODO list:
 *
 * save as image button
 * edit/share fractals
 * manual control over focal point and zoom
 * render a good flame by default
 */

/* Extra space?
 *
 */

// open a new window with canvas as png, for saving
// W.open(c.toDataURL('image/png'));

// very useful aliases
M=Math;
W=window;
R=M.random; 

// setup canvas and window
w = c.width  = W.innerWidth;
h = c.height = W.innerHeight;

// reassign W because we only need setTimeout now
// W = W.setTimeout;

// anti-aliasing
// c.style.width = w/2 + 'px';

// flame settings
// m = [
//     [0.562482, -0.539599, 0.397861, 0.501088, -0.42992, -0.112404],
//     [0.830039, 0.16248, -0.496174, 0.750468, 0.91022, 0.288389]
// ];

// new m example
// m = [
//     [r, g, b], // colour triple
//     [u, v, z], // focus, zoom factor
//     [ // main iterative functions
//         [p, t, a, b, c, d, e, f],  // prob, type, coefficients
//         [p, t, a, b, c, d, e, f],
//         [p, t, a, b, c, d, e, f]
//     ],
//     t // final transformation
// ];

m = [
    [0, 0, 1],
    [
        [2, .5, -.5, R(), .5, -.4, -.1],
        [1, .8, R(), .1, -.5, R(), .2]
        // [2, 0.562482, -0.539599, 0.397861, 0.501088, -0.42992, -0.112404],
        // [2, 0.830039, 0.16248, -0.496174, 0.750468, 0.91022, 0.288389]
    ],
    0
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

// OPT: use m instead?
// random values for colour palette computing
// +.3 to make sure we don't get something too darkk
A = R() + .3;
B = R() + .3;
C = R() + .3;

// array of trig shuffled trig functions
//
// tan gives dark -> high
// sin gives dark -> medium
// cos gives dark -> low
//
// shuffling them gives dark -> random medium colour -> random high colour
// 
// OPT: is there a nicer way to do this?
O = [M.tan,M.sin,M.cos].sort(function(){return .5 - R() });

// compute palette based on t value
function n(i) {
    return [
        255*O[0](i)*i*A, 
        255*O[1](i)*i*B, 
        255*O[2](i)*i*C 
    ];
}

// histogram, array of hits
H = new Array(w*h);

// init. point in x,y plane
// and d to track largest pixel hit
x = y = d = p = 0;

/*
 * Render a flame to canvas
 */
function F() {

    // increase p
    p++;

    // a while loop is smaller than a for loop
    i = 50000;
    while (i--) {

        // pic a function randomly
        // ~~ is the same as Math.floor (and faster)
        g = m[1][~~(R()*m[1].length)];

        // linear equations
        t = g[1] * x + g[2] * y + g[5];
        y = g[3] * x + g[4] * y + g[6];
        // x = t;

        // variables for variations
        // OPT: remove the ones we don't use
        j = t*t + y*y;
        // r  = M.sqrt(r2);
        // T  = M.atan(x/y);
        // P  = M.atan(y/x);

        // t = eval(o[2])[0];
        // y = eval(o[2])[1];
        // x = t;

        switch(g[0]) {
            case 0:
                // identity, do nothing
                // OPT: remove this completely?
            case 1:
                // sinusoidal
                x = M.sin(t);
                y = M.sin(y);
            case 2:
                // spherical
                x = t/j;
                y = y/j;
        }

        // global transformation

        // OPT: rearrange equations to make them smaller
        // scale x and y coordinates to fit in z
        // ~~ is the same as Math.floor (and faster)
        u = ~~( x*(w/1) + w/1 );
        v = ~~(y*(h/1) + h);

        // calculate location of pixel in image buffer
        l = u*w + v;

        // if not defined, make it 1
        // otherwise add 1
        H[l] = H[l] ? H[l]+1 : 1;

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
    Z = z.data;

    // prepare image buffer
    i = w*h;
    while (i--) {
        // logarithmic scale
        t = M.log(H[i])/M.log(d);

        // note, t may be negative but it doesn't matter as n is a function
        // get colour triple from palette function
        q = n(t); 

        // cache 4*i
        j=4*i;

        // set nicely!
        Z[j]   = q[0]; // red
        Z[j+1] = q[1]; // green
        Z[j+2] = q[2]; // blue

        // set alpha to full
        Z[j+3] = 255;
    }
    
    // copy buffer to canvas
    a.putImageData(z, 0, 0);

    // iterate again, if allowed
    if ( p < 100 )
        W.setTimeout(F, 9);
}

// render flame
F();
