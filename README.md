# dsl-example

# in2cloud DSL Overview

While working with AWS Connect contact flows seems easy at first, as your project grows you will quickly run 
into complexity!
- How do I see change history?
- How can I manage multiple environments effectively?
- How can I reuse common logic? e.g. Log in, set standard options etc
- How can I automate testing?
- How can I store my contact flows in source code and seamlessly deploy it?

These are just some of the questions that our framework can help you manage.

## How do I use it?

The framework consists of the following parts:

1. The contact flow, written in the in2cloud dsl language  
 This is the logic of the contact flow body and where you will spend most of your time working. This would typically 
 be stored in a git repository, and consist of the contact flows and associated tests

2. The in2cloud CLI  
 The CLI will take your contact flow in DSL form and compile it to the AWS Connect language. It can also
 optionally deploy it to your Connect instance


## in2cloud Contact Flow DSL Tutorial

### Setup
The first step is to install the in2cloud DSL

1. [Install and configure AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
2. [Install Node.js (v16 or later) and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. Install or update [in2cloud-cli](https://www.npmjs.com/package/@in2cloud/in2cloud-cli) tool: 
>npm i -g @in2cloud/in2cloud-cli@latest

The in2cloud DSL is now ready to use

#### Using the CLI
This repository contains a number of example flows in the `src` folder. To deploy them run the cli command:
>in2cloud-cli deploy src/[flow.json] --key [api-key] --flow [root-flow-id] --region [your AWS Connect region] --instance [your AWS Connect instance]

For example:
>in2cloud-cli deploy src/simple_greeting.json --key DEMO_API_KEY(see below) --flow simple_greeting --region ap-southeast-2 --instance XXXXX-1111-2222-3333-XXXXXXX
The example above should successfully deploy `simple-greeting` flow in your AWS Connect instance

### Tutorial 1: Greeting the user
In this example we are going to create a play a greeting to the user.  
1. Create a new file named `simple_greeting.json`
2. To start, we must create the top level `flows` block:
```json
{
  "flows": [
    {
      "id": "simple_greeting"
    }
  ]
}
```
The code above simply creates the first flow object with the id of `simple_greeting`. But it doesn't do anything yet.
3. Add the blocks that contain the logic:
```json
{
  "flows": [
    {
      "id": "simple_greeting",
      "initial": "start",
      "blocks": {
        "start": {
          "type": "TPlay"
        },
        "disconnect": {
          "type": "TDisconnect"
        }
      }
    }
  ]
}
```
In the code above, we have defined two blocks:  `start` and `disconnect`.

To discover the purpose and syntax of these blocks, refer to the documentation: [in2cloud DSL docs](https://github.com/in2cloud/dsl-doc/blob/master/documentation/README.md)

[TPlay:](https://github.com/in2cloud/dsl-doc/blob/master/documentation/tdslroot-definitions-tplay.md) Plays a message to the caller  
[TDisconnect:](https://github.com/in2cloud/dsl-doc/blob/master/documentation/tdslroot-definitions-tdisconnect.md) End the call via disconnection

The documentation lists two additional attributes required for the `start` block:

- message: This string is the text that will be read to the user
- next: The logical name of the next block to execute. In this example we want to terminate the call after the greeting

The completed flow is now shown below:

```json
{
  "flows": [
    {
      "id": "simple_greeting",
      "initial": "start",
      "blocks": {
        "start": {
          "type": "TPlay",
          "message": "Welcome to simple greeting demo flow",
          "next": "disconnect"
        },
        "disconnect": {
          "type": "TDisconnect"
        }
      }
    }
  ]
}
```

You should now test the flow in your connect instance:

>in2cloud-cli deploy src/simple_greeting.json --key [DEMO_API_KEY] --flow simple_greeting --region ap-southeast-2 --instance XXXXX-1111-2222-3333-XXXXXXX

Once the example has successfully been deployed, call your instance to confirm the message is read back to you!

TODO: add image of deployed flow in connect


### Tutorial 2: Menus and selections
**Note for Taras:** is `simple_menu` and `simple_survey` demonstrating the same thing?
TODO

### Tutorial 3: Echo user choice
TODO

### Tutorial 5: Reusing blocks with subflows
TODO

### Tutorial 6: Lambda invocation (TODO add example flow)
TODO

### Tutorial 7: Combining elements in a larger flow (TODO add example flow)
TODO


