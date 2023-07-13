/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import * as ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import * as vc from '@digitalbazaar/vc';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {decodeSecretKeySeed} from 'bnid';
import {
  cryptosuite as ed255119Cryptosuite
} from '@digitalbazaar/eddsa-2022-cryptosuite';

const _getSeed = (seed = process.env.TEST_KEY_SEED) =>
  decodeSecretKeySeed({
    secretKeySeed: seed || 'z1AZVaiqEq3kXaf4DJD5qXUfdJBFbW1JNe4FF58HwMgVE6u'
  });

/**
 * An extremely basic VP prover. This is not final
 * and will probably change.
 *
 * @param {object} options - Options to use.
 * @param {object} options.presentation - An unsigned VP.
 * @param {object} options.options - Options for the VP.
 *
 * @returns {Promise<object>} Resolves to a signed Vp.
 */
export async function proveVP({presentation, options = {}}) {
  if(!options.suite) {
    const seed = await _getSeed();
    const keyPair = await ed25519Multikey.generate({seed});
    options.suite = new DataIntegrityProof({
      signer: keyPair.signer(),
      cryptosuite: ed255119Cryptosuite
    });
  }
  return vc.signPresentation({presentation, ...options});
}