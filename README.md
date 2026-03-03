npm i
fill .env
docker compose up -d
npm run migration:run
npm start:dev
curl --location 'localhost:3000/users/019cb50e-a01e-7550-a15a-72190520ae0e/debit' \
--header 'Content-Type: application/json' \
--header 'Cookie: uid=6995cd12373dd35a32e688f9' \
--data '{
    "amount": 1
}'


- style guide   ❌
- rate limit    ❌
- test          ❌
- health check  ❌