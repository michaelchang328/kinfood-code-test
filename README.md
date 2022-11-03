**Kin Pet Store**

**Tech stacks used**

[Nestjs](https://docs.nestjs.com/)
[PostgresSQL](https://www.postgresql.org/)
[MikroORM](https://mikro-orm.io/docs/installation)
[AWS-S3](https://aws.amazon.com/s3/?nc1=h_ls)


P.s You might need to install **PostgresSQL**

**Instruction**
1. Just in case, if you need to install **PostgresSQL** and create the database with the name and user in the database.
2. After installed, go to the psql and create the database with the name and user same with the .env file.(Of course, you can use your own env, don't forget to replace yours if you do so.)

**Run the application**
1. Please paste **.env** file or create one and paste the env into it to the root of **backend** directory.
2. Please go into **backend** directory, run **yarn install**.
3. After installed all of the packages, please run the migration command **npx mikro-orm migration:up**
4. Then, seed need to be applied as well, with the command **npx mikro-orm seeder:run**
5. Finally, you should be able to run the app locally with the command **yarn start:dev**
6. I also exported the postman json file, hope you can understand the APIs easier.
5. Enjoy!

**Reminder**
1. After successfully ran the application, please use the **Admin login** API to get the access token into the postman environment.
2. Also, normal user with admin and editor has differnet access levels, bear that in mind, that's mean, need to change the token sometime to test the APIs.