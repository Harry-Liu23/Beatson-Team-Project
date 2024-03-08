# SH01-main

## Name
Beatson Data Portal Project (provisonal)

## Description
This projects aims to bring standardisation to the uploading process of research relating to biological data and the Mouse Model Network (MMN). It will also allow for effective access and discoveriblity of this data in a web-based portal.

## Installation
### Next.js
**Set-up**
- Move to client/beatson-app/ folder. 
- Install node dependancies, ```npm install``` if using node.js package manager.
- ```npm run dev``` will then run front-end webpages on ```localhost:3000```


### Flask
- Move to server/ folder.
- Set up and activate python env to allow ```pip install -r requirement.txt```
- Run the flask application in development mode using ```python -m run```

### Neo4j
- Using desktop neo4j create a project.
- Withing the project create a database version **5.16.0** or **5.12.0** with name ```neo4j``` and password ```12345678``` - this is arbitrary login access credentials for developement.

### Population
- Once the three steps above have been taken.
- Start the next.js app, flask app and start the database created using given credentials.
- Next move back to server/ folder and run ```python -m population.studyPopulationScript```

**These steps should result in ```localhost:3000``` being accessible with abilty to view studies on ```Discorver Studies``` page and uploading new studies at ```Upload Studies``` page** 

## Authors and acknowledgment
This is a closed school project. The main contributors are the developement team whos names are listed:
- Daniel Blain
- Mark Turnbull
- Aubrey Agub
- Alyson Dick
- Fraser Miller
- Abdulrahman Abdulrahman Saleh A H Saleh
- Harry Liu

## License
MIT License