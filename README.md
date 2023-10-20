# 3-Ka-game

## Yet another suika game, but one extra dimension. <br> 또다른 수박게임, 그런데 한 차원 높은.

[Web App link](https://blog.rahon.dev/PF/3-KaGame/)

Feel free modify this. (I appreciate acknowledgement)

## Change physical configuration

You can modify (seudo) physical parameter by changing `PHYSICS` property in `app_comfig.json`.

Each value in `PHYSICS` means...

|Name|Description|
|:---:|:---:|
| floorElasticity | elastic coeff of bottom of box |
| sideWallElasticity | elastic coeff of side walls of box |
| interSphereElasticity | elastic coeff between fruits |
| sphereFriction | loss of velocity due to fruits collision  |
| stillness | supressing too much micro-bounce at floor |
| wallOverwrapCoeff | repulsion between side wall and fruit|
| overwrapRepulsion | repulsion between fruits|
| wallSpinFriction | spin-effect in fruit-wall collision |

I know. Names were poorly given and parametrization is somewhat messy. I'd refactor them later!

## Change appearance

You can modify appearence of fruit as well. Modyfy texture images in `/textures` will do that.