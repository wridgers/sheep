M=Math;W=window;R=M.random;T=M.round;P=M.floor;w=c.width=W.innerWidth;h=c.height=W.innerHeight;m=[[0.5,-0.5,R(),0.5,-0.4,-0.1],[0.8,R(),0.1,-0.5,R(),0.2]];n=Array(256);A=R();B=R();C=R();O=[M.tan,M.sin,M.cos].sort(function(){return 0.5-R()});for(i=256;i--;)j=i/256,n[i]=[O[0](j)*i*(A+0.3),O[1](j)*i*(B+0.3),O[2](j)*i*(C+0.3)];H=Array(w*h);d=y=x=0;
function F(){for(i=5E4;i--;)g=m[P(R()*m.length)],t=g[0]*x+g[1]*y+g[4],y=g[2]*x+g[3]*y+g[5],x=t,r2=x*x+y*y,t=x/r2,y/=r2,x=t,u=T(x*w/5+w/5,0),v=T(y*h/5+h,0),l=u*w+v,void 0==H[l]&&(H[l]=0),H[l]++,H[l]>d&&(d=H[l]);D()}function D(){z=a.createImageData(w,h);for(i=w*h;i--;)t=M.log(H[i])/M.log(d),0<t&&(q=n[P(255*t)],z.data[4*i]=q[0],z.data[4*i+1]=q[1],z.data[4*i+2]=q[2]),z.data[4*i+3]=255;a.putImageData(z,0,0);W.setTimeout(F,10)}W.setTimeout(F,10);
