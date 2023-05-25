# ZKore
## Project Description

We build our on chain reputation proof service which named ZKore base on zero knowledge proof and soul bound token NFT.

Our service could let people using their his/her social credits like twitter account and mapping the reputation credits to  S, A, B, C grade, then add to corresponding Semaphore group. After this step, ZKore will generate a proof by zero knowledge Semaphore protocol for user.

After zero knowledge proof generated, user can use another wallet address which doesn't has any relationship to previous personal information and the proof to mint the corresponding soul bound token NFT.

User can later use his/her wallet with soul bound token NFT to interact with other DAPP or application so that no any private information will be revealed.

The soul bound token reputation NFT could proof in many reputation-needing situation, for example, on chain money borrowing, NFT whitelist, prevent Sybil Attack.

## Demo Film

Zkore v1: User using userId to generate zk proof and mint NFT

https://user-images.githubusercontent.com/15665709/234754813-dd951885-5a21-492e-ac19-29e36c9378df.mp4


Zkore v2: User could add customized zk proof to mint NFT

https://github.com/ZKore-Hachathon/ZKore-FE/assets/15665709/b843e129-950f-41d8-bed6-b4f619cec0a1


## Team Description

- Roy - Smart Contract Developer
- Eric - Front End Developer
- Allen - AI & ZK Engineer

## Links
- [ETHTaipei Hackathon 2023](https://taikai.network/ethtaipei/hackathons/hackathon/overview)
- [Project Intro](https://taikai.network/ethtaipei/hackathons/hackathon/projects/clgrngou2137457001xfdtl5apz2/idea)
- [Youtube Intro](https://www.youtube.com/watch?v=3hnuIYo0luo)
- Github
  - [Front End](https://github.com/ETHTaipei-Hachathon/ZKore-FE)
  - [Smart Contract](https://github.com/ETHTaipei-Hachathon/ZKore)


## Social credit calculation services

- Twitter
  - [twitterscore](https://twitterscore.io/)
  - [tweetscout](https://tweetscout.io/)

# Development 

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3100](http://localhost:3100) with your browser to see the result.

## Build Static Website

```bash
yarn build:exp
```

## Services

- Twitter (for twitter login) - [Twitter Developer Portal](https://developer.twitter.com/en/portal/projects/1649622597318119426/apps/26974710/settings)
- Firebase (for twitter login) - [Firebase Console](https://console.firebase.google.com/project/rep-zkore/overview)
