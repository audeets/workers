import chai from "chai";
import chaithings from "chai-things";
import chailike from "chai-like";

chai.should();
chai.use(chailike);
chai.use(chaithings);

export const expect = chai.expect;
