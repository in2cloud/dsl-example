# dsl-example
How to configure AWS Connect using in2cloud DSL

1. Install and configure AWS CLI
2. Install [in2cloud-cli](https://www.npmjs.com/package/@in2cloud/in2cloud-cli) tool: `npm i -g @in2cloud/in2cloud-cli`
3. To deploy any example flow from `src` subfolder to AWS Connect instance of your choice, 
   run: `in2cloud-cli deploy src/[flow.json] --key 123 --flow [root-flow-id] --region [your AWS Connect region] --instance [your AWS Connect instance]`. 
   Example: `in2cloud-cli deploy src/simple-greeting.json --key 123 --flow simple-greeting --region ap-southeast-2 --instance XXXXX-9c84-4ad5-be33-XXXXXXX` 
