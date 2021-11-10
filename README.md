# dsl-example

## DSL
All examples are in [src](./src) subfolder. 
They all are written using [in2cloud DSL](https://github.com/in2cloud/dsl-doc/blob/master/generated/documentation/README.md) 

## CLI
How to configure AWS Connect using in2cloud DSL

1. Install and configure AWS CLI
2. Install or update [in2cloud-cli](https://www.npmjs.com/package/@in2cloud/in2cloud-cli) tool: `npm i -g @in2cloud/in2cloud-cli@latest`
3. To deploy any example flow from `src` subfolder to AWS Connect instance of your choice, 
   run: `in2cloud-cli deploy src/[flow.json] --key [api-key] --flow [root-flow-id] --region [your AWS Connect region] --instance [your AWS Connect instance]`
   
   **Example:** `in2cloud-cli deploy src/simple_greeting.json --key DEMO_API_KEY(see below) --flow simple_greeting --region ap-southeast-2 --instance XXXXX-9c84-4ad5-be33-XXXXXXX`
4. This should create 'simple-greeting' flow in your AWS Connect instance.

### DEMO API KEY
For testing purposes you can use this free API key: **XGRVeL3LHi2yhuu9eSLMY1NnfxKfiAEX7YMnxQgw** 

This key is for demo purposes only, and should not be used for production purposes,
as it can be expired/disabled/revoked at any time without further notice

