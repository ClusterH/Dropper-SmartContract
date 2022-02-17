/* These tests are not necessary since we are using OZ for this base functionality
const GAS = false;
const Moments = artifacts.require("Dropper");

contract("MomentsTester", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  var gasCost = [];

  beforeEach(async function () {
    this.moments = await Moments.deployed({ from: owner });
  });

  after(async function () {
    if (GAS) {
    const moments = await Moments.deployed({ from: owner});
    const deployGas = await Moments.new.estimateGas();
    console.log("\nGas Metrics:");
    console.log("Contract Deployment Gas: " + deployGas);
    console.log("Batch Mint: 3 items Gas: " + gasCost[0]);
    console.log("Batch Mint: 5 items Gas: " + gasCost[1]);
    console.log("Batch Mint: 7 items Gas: " + gasCost[2]);
    console.log("Contract Deployment address: " + moments.address + "\n");
    }
  });

  it('uri returns a metadata link for a given token id', async function () {
    const uri  = await this.moments.uri.call(1, { from: owner });

    expect(uri).to.be.a('string').to.include("0.0.0.0:80/{id}.json");
  });

  it('mintBatch mints a group of tokens', async function () {
    const mintBatch3Gas = await this.moments.mintBatch.estimateGas(owner, [1,2,3], [1,1,1], "0x0", { from: owner });
    gasCost[0] = mintBatch3Gas;
    const mintBatch5Gas = await this.moments.mintBatch.estimateGas(owner, [1,2,3,4,5], [1,1,1,1,1], "0x0", { from: owner });
    gasCost[1] = mintBatch5Gas;
    const mintBatch7Gas = await this.moments.mintBatch.estimateGas(owner, [1,2,3,4,5,6,7], [1,1,1,1,1,1,1], "0x0", { from: owner });
    gasCost[2] = mintBatch7Gas;
    const mintBatchReceipt = await this.moments.mintBatch(owner, [1,2,3], [5,6,7], "0x0", { from: owner });
    expect(mintBatchReceipt.logs[0].event).equals("TransferBatch");
  });

  it('can get balanceOf one of our tokens', async function () {
    const balance = await this.moments.balanceOf.call(owner, 1);

    expect(5).to.be.equal(balance.toNumber());
  });

  it('can get balanceOfBatch from multiple of our tokens', async function () {
    const balances = await this.moments.balanceOfBatch.call([owner, owner, owner, user1], [1,2,3,0]);
    expect([balances[0].toNumber(), 
            balances[1].toNumber(),
            balances[2].toNumber(),
            balances[3].toNumber()]).eql([5,6,7,0]);
  });

  it('Gets a correct upper 128 bit ID for a Non-Fungible Moment', async function (){
    id = await this.moments.moments(0).momentId;
    const id2 = await this.moments.moments(1).momentId;
    const id3 = await this.moments.moments(2).momentId;
    const id4 = await this.moments.moments(3).momentId;
    expect((id * 2) == id2 && (id * 3) == id3 && (id * 4) == id4);
  })

});
*/