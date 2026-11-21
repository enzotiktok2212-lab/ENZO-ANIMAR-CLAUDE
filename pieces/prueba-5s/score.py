# música de fondo + efectos sintetizados (sin voz): python3 score.py out.wav
import numpy as np, sys, wave
SR=44100; DUR=5.1; n=int(SR*DUR); t=np.arange(n)/SR; mix=np.zeros(n)
def add(sig, at, g=1.0):
    i=int(at*SR); j=min(n,i+len(sig)); mix[i:j]+=sig[:j-i]*g
def env(L,a=0.005,d=0.3):
    x=np.arange(int(L*SR))/SR; return np.minimum(1,x/a)*np.exp(-x/d)
def tone(f,L,d=0.3,h=(1,.4,.2)):
    x=np.arange(int(L*SR))/SR; return sum(a*np.sin(2*np.pi*f*(k+1)*x) for k,a in enumerate(h))*env(L,0.004,d)
rng=np.random.default_rng(1)
BPM=112; beat=60/BPM
chords=[[261.6,329.6,392.0],[196.0,246.9,293.7],[220.0,261.6,329.6],[174.6,220.0,261.6]]
for b in range(int(DUR/beat)+1):
    at=b*beat; ch=chords[(b//4)%4]
    for f in ch: add(tone(f,beat*1.2,0.18),at,0.10)          # plucks alegres en negras
    add(tone(ch[0]/2,beat,0.25,(1,.2)),at,0.22)               # bajo
    k=np.arange(int(.18*SR))/SR; add(np.sin(2*np.pi*(55+90*np.exp(-k*30))*k)*np.exp(-k*18),at,0.35 if b%2==0 else 0.18)  # bombo suave
    hh=rng.normal(0,1,int(.04*SR))*np.exp(-np.arange(int(.04*SR))/SR*120); add(np.diff(hh,prepend=0),at+beat/2,0.05)
pad=sum(np.sin(2*np.pi*f*t)*0.03 for f in (130.8,196.0,329.6)); mix+=pad*np.minimum(1,t/0.3)
def whoosh(L=0.45):
    m=int(L*SR); x=rng.normal(0,1,m); y=np.zeros(m); a=0
    for i in range(m):
        c=0.02+0.25*np.sin(np.pi*i/m); a+=c*(x[i]-a); y[i]=a
    return y*np.sin(np.pi*np.arange(m)/m)
for at in (0.0,1.05,3.65): add(whoosh(),max(0,at-0.15),0.9)
def ding():
    L=0.6; return tone(1568,L,0.18,(1,.3))+tone(2093,L,0.22,(1,.2))*0.8 + np.r_[rng.normal(0,1,300)*0.3,np.zeros(int(L*SR)-300)]
for at in (1.62,2.1,2.58,3.06): add(ding(),at,0.28)
mix/=np.max(np.abs(mix))*1.05
st=np.stack([mix,mix],1)
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype('<i2').tobytes())
