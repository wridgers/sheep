// sheep.js - js1k entry by Will Ridgers
// render iterative function system fractals!

// index of variables
/*
 * a = [global] canvas 2d context
 * b = [global] document.body
 * c = [global] canvas element
 *
 * f = function chosen randomly
 * g = colour to plot
 *
 * h = [global] canvas height
 * i = iterator for loop
 *
 * m = [global] matrix of coefficients
 * p = [global] array of probabilities
 *
 * q = function argument
 * r = function argument, random number
 * s = function argument
 * t = function argument, temp variable
 * u = function argument
 * v = function argument
 *
 * w = [global] canvas width
 *
 * x = x coordinate
 * y = y coordinate
 * z = [global] image buffer
 */ 

// setup canvas and window
w = c.width = 300;      //window.innerWidth;
h = c.height = 300;     //window.innerHeight;

// create image buffer
// everything (r,g,b,a) will be zero
z = a.createImageData(w,h);

// Barnsley fern
/*
p = [0.01, 0.07, 0.07, 0.85];
// function coefficients
m = [
    [0,     0,     0,     0.16, 0, 0   ], // function 1 (prob, p[0])
    [0.2,   -0.26, 0.23,  0.22, 0, 1.6 ], // function 2 (prob, p[1])
    [-0.15, 0.28,  0.26,  0.24, 0, 0.44], // function 3 (prob, p[2])
    [0.85,  0.04,  -0.04, 0.85, 0, 1.6 ]  // function 4 (prob, p[3])
];
*/

// Some other example from a PDF
p = [0.5, 0.5];
m = [
    [ 0.164856, -0.775017, 0.664133, 0.504859, -0.400526, 0.155692 ],
    [ -0.14321, -0.540632, 0.427958, 0.0901299, 2.14451, 2.54161 ]
];

// render
function render(q, r, s, t, u, v) {

    // clear screen
    a.fillStyle = '#000';
    a.fillRect(0, 0, w, h);

    // initial conditions
    x = 0;
    y = 0;

    for (var i = 0; i < 80000; i++) {

        // random number
        r = Math.random();

        // pick f randomly
        f = 0; // function to choose
        g = 0; // running total of probability

        for (j in p) {
            g += p[j];
            if (r <= g) break;
            f++;
        }

        t = m[f][0] * x + m[f][1] * y + m[f][4];
        y = m[f][2] * x + m[f][3] * y + m[f][5];
        x = t;

        plot(x, y, '#fff');
    }

}

/*
 * q - x coord
 * r - y coord
 * s - colour
 */
function plot(q, r, s, t, u, v) {
    // map xy plane to canvas
    q *= 30;
    r *= 30;

    q += w/2;
    r += h/3;

    // plot pixel of correct colour
    a.fillStyle = s;
    a.fillRect(q, r, 0.5, 0.5);
}

render();
