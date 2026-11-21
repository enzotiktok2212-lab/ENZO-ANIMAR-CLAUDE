#!/usr/bin/env python3
"""Acelera tramos dados (sin cambiar el tono). uso: acelerar.py in out factor a1-b1 a2-b2 ..."""
import subprocess,sys,numpy as np
src,out,f=sys.argv[1],sys.argv[2],float(sys.argv[3]);R=44100
g=[tuple(map(float,x.split('-'))) for x in sys.argv[4:]]
pcm=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar',str(R),'-f','f32le','-'],capture_output=True).stdout,np.float32)
parts=[];p=0
for a,b in g:
    A,B=int(a*R),int(b*R);parts.append(pcm[p:A])
    parts.append(np.frombuffer(subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(R),'-ac','1','-i','-','-af',f'atempo={f}','-f','f32le','-'],input=pcm[A:B].tobytes(),capture_output=True).stdout,np.float32));p=B
parts.append(pcm[p:])
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(R),'-ac','1','-i','-',out],input=np.concatenate(parts).tobytes(),check=True)
