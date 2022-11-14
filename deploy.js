const { Provider } = require("@ethersproject/abstract-provider")
const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()
async function main() {
  //http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("wait for....")
  const contaract = await contractFactory.deploy()
  await contaract.deployTransaction.wait(1)
  console.log(`transacattion address is:${contaract.address}`)
  const currentfavoriteNumber = await contaract.retrieve()
  console.log(`currentfaouritnumber is: ${currentfavoriteNumber.toString()}`)
  const transactionResponse = await contaract.store("9")
  const transactionReciept = await transactionResponse.wait(1)
  const updatedfavoutritnumber = await contaract.retrieve()
  console.log(`updated faourite number is:${updatedfavoutritnumber.toString()}`)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
