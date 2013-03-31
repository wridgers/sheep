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
 * D = document
 * e = colour coordinate
 * E = html element
 * f = function chosen randomly
 * F = render a flame
 * g = m[f]
 * G = element cache
 * h = [global] canvas height
 * H = [global] histogram
 * i = iterator for loop
 * I = init function
 * j = iterator for loop
 * J = D.getElementById('f').value
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
 * manual control over focal point and zoom
 */

// very useful aliases
D=document;
M=Math;
W=window;
R=M.random; 


/*
 * Render a flame to canvas
 */
function F() {

    // a while loop is smaller than a for loop
    i = 50000;
    while (i--) {

        // pic a function randomly
        // ~~ is the same as Math.floor (and faster)
        g = m[3][~~(R()*m[3].length)];

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
        u = ~~(x*w + w);
        v = ~~(y*h + h);

        // calculate location of pixel in image buffer
        l = u*w + v;

        // if not defined, make it 1
        // otherwise add 1
        H[l] = H[l] ? H[l]+1 : 1;

        // keep largest hit
        if (H[l] > d)
            d = H[l];
    }

    // create image buffer
    z = a.createImageData(w,h);
    Z = z.data;

    // prepare image buffer
    i = w*h;
    while (i--) {
        // logarithmic scale
        t = M.log(H[i])/M.log(d);

        // cache 4*i
        j=4*i;

        // set nicely!
        Z[j]   = n(t,0); // red
        Z[j+1] = n(t,1); // green
        Z[j+2] = n(t,2); // blue

        // set alpha to full
        Z[j+3] = 255;
    }
    
    // copy buffer to canvas
    a.putImageData(z, 0, 0);

    // do it again!
    W.setTimeout(F, 9);
}

function I() {
    // setup canvas and window
    w = c.width  = W.innerWidth;
    h = c.height = W.innerHeight;

    // make it full screen
    // c.style.width = w*2 + 'px';

    // histogram, array of hits
    H = new Array(w*h);

    // convert input variables to real array we can use
    m = JSON.parse(J.value);
    
    // go!
    F();
}

// make all these variables global.
x = y = d = w = h = H = m = 0;

// make gui element
E = D.createElement('i');
E.innerHTML = '<textarea id=f></textarea><button onclick=I();>▶</button><button onclick=W.open(c.toDataURL(\'image/png\'));>★</button>';

// set style
G = E.style;
G.top = G.left = 0;
G.position = 'absolute';

// add to dom
b.appendChild(E);

// tan gives dark -> high
// sin gives dark -> medium
// cos gives dark -> low
O = [M.tan,M.sin,M.cos];

// compute palette based on t value
function n(i,j) { return 255*O[m[1][j]](i)*i*m[0][j]; }

// drake's cloud flame
// [
//     [2, 0.562482, -0.539599, 0.397861, 0.501088, -0.42992, -0.112404],
//     [2, 0.830039, 0.16248, -0.496174, 0.750468, 0.91022, 0.288389]
// ];

m = [
    [1, 1, 1],
    [0, 1, 2], 
    [0, 0, 1],
    [
        [2, .56, -.53, .397, .50, -.42, -.11],
        [2, .83, .162, -.49, .75, .910, .288]
    ]
];

// set input area
J = D.getElementById('f');
J.value = JSON.stringify(m);
