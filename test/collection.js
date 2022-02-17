const Collection = artifacts.require('Collection');
const Dropper = artifacts.require("Dropper");
const BN = web3.utils.BN;

momentStruct = {
    "rarityId": 'uint256',
    "momentURI": 'uint256',
    "totalMinted": 'uint256'
}

packStruct = {
    "packURI": 'uint256',
    "momentQuantity": 'uint256',
    "momentGuarantees": 'uint256[5]'
}

time = Math.floor(new Date().getTime()/1000.0);

// Collection.deployed().then(function(instance) { c = instance })

contract("CollectionTester", function (accounts) {
    const owner = accounts[0];

    beforeEach(async function () {
        this.collection = await Collection.deployed({ from: owner });
        this.dropper = await Dropper.deployed({ from: owner });
        //console.log(this.collection.methods);
    });

    it('Has an accessible lock date returned in seconds after unix epoch', async function() {
        const lockDate = await this.collection.lockDate.call({ from:owner });
        expect(lockDate.toNumber()+1).to.be.above(time);
    });

    /* Basis odds now hardcoded
    it('Calculates the basis points from the rarity odds', async function () {
        total = 0;
        for ( i = 0; i < 5; i++) {
            rarityOdds = await this.collection.rarityOdds.call(i);
            total += rarityOdds.toNumber();
        }
        const basis = await this.collection.basisPoints.call();
        expect(basis.toNumber()).eql(total);
    })
    */

    /* Base mint range now hardcoded
    it('Properly creates base range for mint ids', async function () {
      Change function visibilty to public
      common = [0,0,0,0,0];
      common[0] = await this.collection._baseMintRange(0);
      common[1] = await this.collection._baseMintRange(1);
      common[2] = await this.collection._baseMintRange(2);
      common[3] = await this.collection._baseMintRange(3);
      common[4] = await this.collection._baseMintRange(4);
      bases = [160, 90, 40, 10, 0];
      expect(common[0].toNumber()).eql(bases[0]);
      expect(common[1].toNumber()).eql(bases[1]);
      expect(common[2].toNumber()).eql(bases[2]);
      expect(common[3].toNumber()).eql(bases[3]);
      expect(common[4].toNumber()).eql(bases[4]);
    }) */
  
    /*
    it('Generates a new subId for a moment', async function() {
      //await debug(this.collection.test(5));
      // JS testing does not return accurate results with sync calls
      for (i = 0; i < 50; i++) {
        await (this.collection.getSubId(5, 3, 1));
        const newId = await this.collection.getSubId.call(5, 3, 1);
        console.log(i + ": " + newId.toNumber());
      }
      //expect(newid.toNumber().to.be.a('number'));
    })
    */

    /* No way to validate output without massive sample size
    it('Creates a proper distribution of moment rarities', async function(){
      rarity = [];
      for (i=0; i<100; i++){
        await debug(this.collection._getRarity(0, ['5250', '3500', '1000', '240', '10'], 1132247));
        rarity[i] = await this.collection._getRarity.call(0, ['5250', '3500', '1000', '240', '10'], 1132247);
        rarity[i] = rarity[i].toNumber();
      }
      console.log(rarity);
      //const genRarity = await this.collection._getRarity(0);
    })
    */

    /* Internal function, move to TestInternals
    it('Gets a moment with correct ID, subID, and rarity', async function(){
      await debug(this.collection._getMoment(0, ['5250', '3500', '1000', '240', '10']));
      const result = await this.collection._getMoment.call(0, ['5250', '3500', '1000', '240', '10']);
    })
    */

    it('Calculates the cost to mint a pack', async function(){
      //await debug(this.collection.mintPack(owner, 1, 5));
    })

    it('Generates a moment', async function(){
      //await debug(this.collection.testGenMoment(0, [2000,2000,2000,2000,2000] ));
    })

    it('Calculates the correct price for a pack', async function(){
      await this.collection.buyPacks(3,5, {from: owner, value: 50000000});
      const balance = await this.dropper.balanceOf(owner, 3, {from:owner});
      expect(balance == 5);
    })

    it('Opens a Pack', async function(){
      await debug(this.collection.openPacks(1, {from: owner}));
      const moments = (await this.collection.openPacks.call(1, {from: owner}));
      const packBalance = await this.collection._balanceOf.call(owner, 1, {from:owner});
      const momentBalance = await this.collection._balanceOf.call(owner, moments[0]);
      //expect(packBalance == 3);
      //expect(momentBalance.toNumber == 1);
    })

});
