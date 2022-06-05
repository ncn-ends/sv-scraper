<img src="https://i.imgur.com/EnAmPfX.png" alt="Banner for repo">

# sv-scraper


## Introduction
This is a simple web scraper that gathers data and icon for Starcraft 2 to serve as data for demonstration purposes for the POC / MVP stage of [StrategyVault](https://github.com/ncn-ends/StrategyVault).  

Data gathered via this scraper will not be used in any official release of a website under the StrategyVault project.

## Getting Started (Development)

1) Clone / pull the repo.

2) Install dependencies.
```
yarn install
```

3) Run the program
```
yarn run
```

- There will be a `out` directory created at project root.  
- `out/gamedata.json` will contain unit info
    - unit name
    - description
    - faction
    - imagelink
    - id
        - id is created arbitrarily based on the order that the unit appears on the page
        - id's are unique
- `out/images/` contains unit images
    - note: you can use the wiki link for images as well

## Authors

- [@ncn-ends](https://www.github.com/ncn-ends)

## License

[MIT](https://choosealicense.com/licenses/mit/)