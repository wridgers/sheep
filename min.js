M=Math;W=window;R=M.random;w=c.width=W.innerWidth;h=c.height=W.innerHeight;W=W.setTimeout;m=[[0.5,-0.5,R(),0.5,-0.4,-0.1],[0.8,R(),0.1,-0.5,R(),0.2]];A=R()+0.3;B=R()+0.3;C=R()+0.3;O=[M.tan,M.sin,M.cos].sort(function(){return 0.5-R()});function n(b){return[255*O[0](b)*b*A,255*O[1](b)*b*B,255*O[2](b)*b*C]}H=Array(w*h);x=y=d=0;
function F(){for(i=5E4;i--;)g=m[~~(R()*m.length)],t=g[0]*x+g[1]*y+g[4],y=g[2]*x+g[3]*y+g[5],j=t*t+y*y,y/=j,x=t/j,u=~~(x*(w/5)+w/5),v=~~(y*(h/5)+h),l=u*w+v,H[l]=H[l]?H[l]+1:1,H[l]>d&&(d=H[l]);D()}function D(){z=a.createImageData(w,h);Z=z.data;for(i=w*h;i--;)t=M.log(H[i])/M.log(d),q=n(t),j=4*i,Z[j]=q[0],Z[j+1]=q[1],Z[j+2]=q[2],Z[j+3]=255;a.putImageData(z,0,0);W(F,9)}F();
