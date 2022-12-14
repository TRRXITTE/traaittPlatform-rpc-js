// Copyright (c) 2018-2019, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const packageInfo = require('../package.json')
const request = require('request-promise-native')
const util = require('util')

/**
 * @module ETRXnetwork
 * @class
 */
class ETRXnetwork {
  /**
   * Initializes a new ETRXnetwork object
   * @constructor
   * @param {Object} [opts] - Configuration options
   * @param {string} [opts.host=127.0.0.1] - the address of the daemon
   * @param {string} [opts.port=14486] - the RPC port number of the daemon
   * @param {number} [opts.timeout=2000] - the timeout to use during RPC calls
   * @param {boolean} [opts.ssl=false] - whether the daemon uses SSL (HTTPS) or not
   * @param {string} [opts.userAgent=turtlecoin-rpc/version] - the user agent string to use with requests
   */
  constructor (opts) {
    opts = opts || {}
    this.host = opts.host || '127.0.0.1'
    this.port = opts.port || 14486
    this.timeout = opts.timeout || 2000
    this.ssl = opts.ssl || false
    this.userAgent = opts.userAgent || util.format('%s/%s', packageInfo.name, packageInfo.version)
  }

  /**
   * RPC GET Request
   * @async
   * @private
   * @param {string} method - the RPC method to call
   * @returns {Object} the response
   */
  _get (method) {
    return new Promise((resolve, reject) => {
      if (method.length === 0) return reject(new Error('no method supplied'))
      var protocol = (this.ssl) ? 'https' : 'http'

      request({
        uri: util.format('%s://%s:%s/%s', protocol, this.host, this.port, method),
        method: 'GET',
        json: true,
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent
        }
      }).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * RPC POST Request
   * @async
   * @private
   * @param {string} method - the RPC method to call
   * @param {Object} params - the parameters for the RPC POST request
   * @returns {Object} the response
   */
  _post (method, params) {
    return new Promise((resolve, reject) => {
      if (method.length === 0) return reject(new Error('no method supplied'))
      params = params || {}

      var body = {
        jsonrpc: '2.0',
        method: method,
        params: params
      }

      this._rawPost('json_rpc', body).then((result) => {
        if (!result.error) {
          return resolve(result.result)
        } else {
          return reject(result.error.message)
        }
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * RPC raw POST Request
   * @async
   * @private
   * @param {string} endpoint - the RPC endpoint to call
   * @param {Object} body - the body of the POST request
   * @returns {Object} the response
   */
  _rawPost (endpoint, body) {
    return new Promise((resolve, reject) => {
      if (endpoint.length === 0) return reject(new Error('no endpoint supplied'))
      if (body === undefined) return reject(new Error('no body supplied'))
      var protocol = (this.ssl) ? 'https' : 'http'

      request({
        uri: util.format('%s://%s:%s/%s', protocol, this.host, this.port, endpoint),
        method: 'POST',
        body: body,
        json: true,
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent
        }
      }).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Transaction Summary
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionSummary
   * @property {number} amount_out - the amount of the transaction
   * @property {number} fee - the fee of the transaction
   * @property {string} hash - the hash of the transaction
   * @property {number} size - the size of the transaction
   */

  /**
   * Block Summary
   * @memberof ETRXnetwork
   * @typedef {Object} BlockSummary
   * @property {number} alreadyGeneratedCoins - the number of already generated coins
   * @property {number} alreadyGeneratedTransactions - the number of already generated transactions
   * @property {number} baseReward - the block base reward
   * @property {number} blockSize - the block size
   * @property {number} depth - the depth of the block in the chain (aka. confirmations)
   * @property {number} difficulty - the block difficulty
   * @property {number} effectiveSizeMedian - the effective median size of the blocks
   * @property {string} hash - the block hash
   * @property {number} height - the block height
   * @property {number} major_version - the block major version
   * @property {number} minor_version - the block minor version
   * @property {number} nonce - the block nonce
   * @property {boolean} orphan_status - whether the block is an orphan
   * @property {number} penalty - the block penalty
   * @property {string} prev_hash - the previous block hash
   * @property {number} reward - the block reward
   * @property {number} sizeMedian - the median block size
   * @property {number} timestamp - the block timestamp
   * @property {number} totalFeeAmount - the total amount of fees in the block
   * @property {ETRXnetwork.TransactionSummary[]} transactions
   * @property {number} transactionsCumulativeSize - the total size of the transactions in the block
   */

  /**
   * Returns information on a single block by hash
   * @async
   * @param {string} hash - the hash of the block to retrieve
   * @returns {Promise<ETRXnetwork.BlockSummary>} resolves with block summary or rejects with error
   */
  block (hash) {
    return new Promise((resolve, reject) => {
      if (!hash) return reject(new Error('must specify hash'))

      this._post('f_block_json', {
        hash: hash
      }).then((result) => {
        return resolve(result.block)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Gets the current block count
   * @async
   * @returns {Promise<number>} resolves with the current block count or rejects with error
   */
  blockCount () {
    return new Promise((resolve, reject) => {
      this._post('getblockcount').then((result) => {
        return resolve(result.count)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Block Header
   * @memberof ETRXnetwork
   * @typedef {Object} BlockHeader
   * @property {number} block_size - the block size
   * @property {number} depth - the depth of the block in the chain (aka. confirmations)
   * @property {number} difficulty - the block difficulty
   * @property {string} hash - the block hash
   * @property {number} height - the block height
   * @property {number} major_version - the block major version
   * @property {number} minor_version - the block minor version
   * @property {number} nonce - the block nonce
   * @property {number} num_txes - the number of transactions in the block
   * @property {boolean} orphan_status - whether the block is an orphan
   * @property {string} prev_hash - the previous block hash
   * @property {number} reward - the block reward
   * @property {number} timestamp - the block timestampe total size of the transactions in the block
   */

  /**
   * Gets the block header
   * @async
   * @param {string} hash - the hash of the block to retrieve
   * @returns {Promise<ETRXnetwork.BlockHeader>} resolves with block header or rejects with error
   */
  blockHeaderByHash (hash) {
    return new Promise((resolve, reject) => {
      if (!hash) return reject(new Error('must specify hash'))

      this._post('getblockheaderbyhash', {
        hash: hash
      }).then((result) => {
        return resolve(result.block_header)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Gets the block header
   * @async
   * @param {number} height - the height of the block to retrieve
   * @returns {Promise<ETRXnetwork.BlockHeader>} resolves with block header or rejects with error
   */
  blockHeaderByHeight (height) {
    return new Promise((resolve, reject) => {
      if (typeof height === 'undefined') return reject(new Error('must specify height'))

      this._post('getblockheaderbyheight', {
        height: height
      }).then((result) => {
        return resolve(result.block_header)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Block Short Summary
   * @memberof ETRXnetwork
   * @typedef {Object} BlockShortHeader
   * @property {number} cumul_size - the total size of the block
   * @property {number} difficulty - the difficulty of the block
   * @property {string} hash - the block hash
   * @property {number} height - the height of the block
   * @property {number} timestamp - the timestamp of the block
   * @property {number} tx_count - the number of transactions in the block
   */

  /**
   * Gets the summary block information for the last 30 blocks before height (inclusive)
   * @async
   * @param {number} height - the height of the block to retrieve
   * @returns {Promise<ETRXnetwork.BlockShortHeader[]>} resolves with block short headers or rejects with error
   */
  blockShortHeaders (height) {
    return new Promise((resolve, reject) => {
      if (typeof height === 'undefined') return reject(new Error('must specify height'))

      this._post('f_blocks_list_json', {
        height: height
      }).then((result) => {
        return resolve(result.blocks)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Transaction Extra Detail
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionExtraDetail
   * @property {number[]} [nonce] - the nonce
   * @property {string} publicKey - the public key
   * @property {string} raw - the raw transaction extra
   */

  /**
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetailInputCoinbaseInput
   * @property {number} height - the height of the block
   */

  /**
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetailInputCoinbase
   * @property {number} amount - the amount of the input
   * @property {ETRXnetwork.TransactionDetailInputCoinbaseInput} input - the input
   */

  /**
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetailInputKeyOutput
   * @property {number} number - the output index of the output used
   * @property {string} transactionHash - the transaction hash of the output

  /**
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetailInputKeyInput
   * @property {number} amount - the amount of the input
   * @property {string} k_image - the key image of the input
   * @property {number[]} key_offsets - the key offsets of the input
   */

  /**
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetailInputKey
   * @property {ETRXnetwork.TransactionDetailInputKeyInput} input - the input
   * @property {number} mixin - the ring size
   * @property {ETRXnetwork.TransactionDetailInputKeyOutput} output - the related output information
   */

  /**
   * Transaction Detail Input
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetailInput
   * @property {ETRXnetwork.TransactionDetailInputCoinbase|ETRXnetwork.TransactionDetailInputKey} data - the input data
   * @property {string} type - the input type
   */

  /**
   * Transaction Output Target Data
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionOutputTargetData
   * @property {string} key - the output key
   */

  /**
   * Transaction Output Target
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionOutputTarget
   * @property {ETRXnetwork.TransactionOutputTargetData} data - output data structure
   * @property {string} type - the output type
   */

  /**
   * Transaction Output
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionOutput
   * @property {number} amount - the amount of the output
   * @property {ETRXnetwork.TransactionOutputTarget} target - the output target
   */

  /**
   * Transaction Detail Output
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetailOutput
   * @property {number} globalIndex - the global index of the output
   * @property {ETRXnetwork.TransactionOutput} output - The transaction output
   */

  /**
   * Transaction Details
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionDetail
   * @property {string} blockHash - the block hash
   * @property {number} blockIndex - the block index (aka. height)
   * @property {ETRXnetwork.TransactionExtraDetail} extra - the transaction extra
   * @property {number} fee - the transaction fee
   * @property {string} hash - the transaction hash
   * @property {boolean} inBlockchain - whether the transaction is in the blockchain
   * @property {ETRXnetwork.TransactionDetailInput[]} inputs - the inputs of the transaction
   * @property {number} mixin - the number of transaction mixins
   * @property {ETRXnetwork.TransactionDetailOutput[]} outputs - the outputs of the transaction
   * @property {string} paymentId - the payment ID of the transaction
   * @property {string[]} signatures - the signatures of the transaction
   * @property {number} signaturesSize - the size of the signatures
   * @property {number} size - the transaction size
   * @property {number} timestamp - the transaction timestamp
   * @property {number} totalInputsAmount - the total amount of the transaction's inputs
   * @property {number} totalOutputsAmount - the total amount of the transaction's outputs
   * @property {number} unlockTime - the unlock time/block of the transaction
   */

  /**
   * Block Details
   * @memberof ETRXnetwork
   * @typedef {Object} BlockDetails
   * @property {number} alreadyGeneratedCoins - the number of already generated coins
   * @property {number} alreadyGeneratedTransactions - the number of already generated transactions
   * @property {number} baseReward - the block base reward
   * @property {number} blockSize - the block size
   * @property {number} depth - the depth of the block in the chain (aka. confirmations)
   * @property {number} difficulty - the block difficulty
   * @property {string} hash - the block hash
   * @property {number} index - the block index (aka. height)
   * @property {number} majorVersion - the block major version
   * @property {number} minorVersion - the block minor version
   * @property {number} nonce - the block nonce
   * @property {string} prevBlockHash - the previous block hash
   * @property {number} reward - the block reward
   * @property {number} sizeMedian - the median block size
   * @property {number} timestamp - the block timestamp
   * @property {number} totalFeeAmount - the total amount of fees in the block
   * @property {ETRXnetwork.TransactionDetail[]} transactions
   * @property {number} transactionsCumulativeSize - the total size of the transactions in the block
   */

  /**
   * Query Blocks Detailed Response
   * @memberof ETRXnetwork
   * @typedef {Object} BlocksDetailedResponse
   * @property {ETRXnetwork.BlockDetails} blocks - the blocks
   * @property {number} currentHeight - the current height of the blockchain
   * @property {number} fullOffset
   * @property {number} startHeight - the height at which this response starts
   * @property {string} status - the response status
   */

  /**
   * Returns up to 100 blocks. If blockHashes are given, it will return beginning from the height of the first hash it finds, plus one.
   * However, if timestamp is given, and this value is higher than the blockHashes, it will start returning from that height instead.
   * The blockHashes should be given with the highest block height hashes first.
   * First 10 blocks hashes go sequential, next in pow(2,n) offset, like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block
   * Typical usage: specify a start timestamp initially, and from then on, also provide the returned block hashes.
   * @async
   * @param {Object} [opts] - the options to use when syncing
   * @param {number} [opts.timestamp=0] - the timestamp to start from
   * @param {string[]} [opts.blockHashes] - the block hashes
   * @param {number} [opts.blockCount=0] - the number of blocks to return
   * @returns {Promise<ETRXnetwork.BlocksDetailedResponse>} resolves with blocks detail information or rejects with error
   */
  blocksDetailed (opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {}
      if (!Array.isArray(opts.blockHashes)) return reject(new Error('must supply an array of block hashes'))
      if (opts.timestamp === undefined) opts.timestamp = 0
      if (opts.blockCount === undefined) opts.blockCount = 100

      var body = {
        blockIds: opts.blockHashes,
        timestamp: opts.timestamp,
        blockCount: opts.blockCount
      }

      this._rawPost('queryblocksdetailed', body).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * @memberof ETRXnetwork
   * @typedef BlockLite
   * @property {string} block - the hexadecimcal representation of the block
   * @property {string} hash - the block hash
   * @property {ETRXnetwork.TransactionPrefix[]} transactions - the transactions in the block
   */

  /**
   * @memberof ETRXnetwork
   * @typedef BlocksLiteResponse
   * @property {number} currentHeight - the current height
   * @property {number} fullOffset - the full offset height
   * @property {ETRXnetwork.BlockLite[]} items - the block data
   * @property {number} startHeight - the height the response starts from
   * @property {string} status - the status of the request
   */

  /**
   * Returns up to 100 blocks. If blockHashes are given, it will return beginning from the height of the first hash it finds, plus one.
   * However, if timestamp is given, and this value is higher than the blockHashes, it will start returning from that height instead.
   * The blockHashes should be given with the highest block height hashes first.
   * First 10 blocks hashes go sequential, next in pow(2,n) offset, like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block
   * Typical usage: specify a start timestamp initially, and from then on, also provide the returned block hashes.
   * @async
   * @param {Object} [opts] - the options to use when syncing
   * @param {number} [opts.timestamp=0] - the timestamp to start from
   * @param {string[]} [opts.blockHashes] - the block hashes
   * @returns {Promise<ETRXnetwork.BlocksLiteResponse>} resolves with block information or rejects with error
   */
  blocksLite (opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {}
      if (!Array.isArray(opts.blockHashes)) return reject(new Error('must supply an array of block hashes'))
      if (opts.timestamp === undefined) opts.timestamp = 0

      var body = {
        blockIds: opts.blockHashes,
        timestamp: opts.timestamp
      }

      this._rawPost('queryblockslite', body).then((result) => {
        /* The response returned by the daemon is a nightmare but we're going to clean it up a bit */
        const tmp = []
        result.items.forEach((item) => {
          const transactions = []

          item['blockShortInfo.txPrefixes'].forEach((txn) => {
            transactions.push({
              hash: txn['transactionPrefixInfo.txHash'],
              prefix: txn['transactionPrefixInfo.txPrefix']
            })
          })

          tmp.push({
            block: Buffer.from(item['blockShortInfo.block']).toString('hex'),
            hash: item['blockShortInfo.blockId'],
            transactions: transactions
          })
        })
        result.items = tmp

        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Block Template Response
   * @memberof ETRXnetwork
   * @typedef {Object} BlockTemplateResponse
   * @property {string} blocktemplate_blob - the raw block template
   * @property {number} difficulty - the target difficulty
   * @property {number} height - the block height
   * @property {number} reserved_offset - the reserved offset location in the raw block template
   * @property {string} status - the response status
   */

  /**
   * Gets the block template using the supplied parameters
   * @async
   * @param {string} walletAddress - the wallet address for the block template
   * @param {number} reserveSize - the amount of block template reserve space to generate
   * @returns {Promise<ETRXnetwork.BlockTemplateResponse>} resolves with block template response or rejects with error
   */
  blockTemplate (walletAddress, reserveSize) {
    return new Promise((resolve, reject) => {
      if (typeof reserveSize === 'undefined') return reject(new Error('must specify reserveSize'))
      if (!walletAddress) return reject(new Error('must specify walletAddress'))

      this._post('getblocktemplate', {
        reserve_size: reserveSize,
        wallet_address: walletAddress
      }).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Node Fee Response
   * @memberof ETRXnetwork
   * @typedef {Object} NodeFee
   * @property {string} address - the node fee address
   * @property {number} amount - the node fee amount
   * @property {string} status - the response status
   */

  /**
   * Retrieves the node fee in atomic units
   * @async
   * @returns {Promise<ETRXnetwork.NodeFee>} resolves with node fee information or rejects with error
   */
  fee () {
    return new Promise((resolve, reject) => {
      this._get('fee').then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Returns the global output indexes of the transaction
   * @async
   * @param {string} transactionHash - the hash of the transaction to retrieve
   * @returns {Promise<number[]>} resolves with indexes global output indexes or rejects with error
   */
  globalIndexes (transactionHash) {
    return new Promise((resolve, reject) => {
      if (typeof transactionHash === 'undefined') return reject(new Error('must supply a transaction hash'))

      var body = {
        txid: transactionHash
      }

      this._rawPost('get_o_indexes', body).then((result) => {
        if (result.status.toLowerCase() !== 'ok') return reject(new Error('Transaction not found'))
        return resolve(result.o_indexes)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Global Indexes Range Response
   * @memberof ETRXnetwork
   * @typedef {Object} GlobalIndexesResponse
   * @property {string} key - the transaction hash
   * @property {number[]} value - the global output indexes
   */

  /**
   * Returns the global indexes for any transactions in the range [startHeight .. endHeight]. Generally, you only want the global index for a specific transaction, however, this reveals that you probably are the recipient of this transaction. By supplying a range of blocks, you can obfusticate which transaction you are enquiring about.
   * @async
   * @param {number} startHeight - The height to begin returning indices from
   * @param {number} endHeight - The height to end returning indices from
   * @returns {Promise<ETRXnetwork.GlobalIndexesResponse[]>} resolves with global indexes information or rejects with error
   */
  globalIndexesForRange (startHeight, endHeight) {
    return new Promise((resolve, reject) => {
      if (typeof startHeight === 'undefined') return reject(new Error('Must specify start height'))
      if (typeof endHeight === 'undefined') return reject(new Error('Must specify end height'))

      this._rawPost('get_global_indexes_for_range', {
        startHeight: startHeight,
        endHeight: endHeight
      }).then((result) => {
        if (!result.status || !result.indexes) {
          return reject(new Error('Missing indexes or status key'))
        }
        if (result.status.toLowerCase() !== 'ok') {
          return reject(new Error('Status not OK'))
        }
        return resolve(result.indexes)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Node Height Response
   * @memberof ETRXnetwork
   * @typedef {Object} NodeHeight
   * @property {number} height - the current height of the node
   * @property {number} network_height - the observed network height
   * @property {string} status - the response status
   */

  /**
   * Returns the current daemon height statistics
   * @async
   * @returns {Promise<ETRXnetwork.NodeHeight>} resolves with node height information or rejects with error
   */
  height () {
    return new Promise((resolve, reject) => {
      this._get('height').then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Node Info Response
   * @memberof ETRXnetwork
   * @typedef {Object} NodeInfo
   * @property {number} alt_blocks_count - the number of alternate blocks the node knows about
   * @property {number} difficulty - the current network difficulty
   * @property {number} grey_peerlist_size - the number of currently gray listed peers
   * @property {number} hashrate - the network hash rate
   * @property {number} height - the current height of the node
   * @property {number} incoming_connections_count - the number of incoming connections to the node
   * @property {number} last_known_block_index - the last known block index
   * @property {number} major_version - the current block major version
   * @property {number} minor_version - the current block minor version
   * @property {number} network_height - the observed network height
   * @property {number} outgoing_connections_count - the number of outgoing connections from the node
   * @property {number} start_time - the timestamp of when the node was started
   * @property {string} status - the response status
   * @property {number} supported_height - the height as which the code the node is running is supported until
   * @property {boolean} synced - whether the node is fully synced with the network or not
   * @property {number} tx_count - the number of transactions the node knows of
   * @property {number} tx_pool_size - the number of transactions in the node's mempool
   * @property {number[]} upgrade_heights - the list of upgrade heights the node is aware of
   * @property {string} version - the version number of the node software
   * @property {number} white_peerlist_size - the number of currently whitelisted peers
   */

  /**
   * Returns the current daemon information
   * @async
   * @returns {Promise<ETRXnetwork.NodeInfo>} resolves with node information or rejects with error
   */
  info () {
    return new Promise((resolve, reject) => {
      this._get('info').then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Retrieves the last block header
   * @async
   * @returns {Promise<ETRXnetwork.BlockHeader>} resolves with block header or rejects with error
   */
  lastBlockHeader () {
    return new Promise((resolve, reject) => {
      this._post('getlastblockheader').then((result) => {
        return resolve(result.block_header)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Node Peers Response
   * @memberof ETRXnetwork
   * @typedef {Object} NodePeers
   * @property {string[]} gray_peers - graylisted peers
   * @property {string[]} peers - peers
   * @property {string} status - the response status
   */

  /**
   * Returns the current daemon peers
   * @async
   * @returns {Promise<ETRXnetwork.NodePeers>} resolves with node peer information or rejects with error
   */
  peers () {
    return new Promise((resolve, reject) => {
      this._get('peers').then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * @memberof ETRXnetwork
   * @typedef PoolChangesAdded
   * @property {string} hash - the transaction hash
   * @property {ETRXnetwork.TransactionPrefix} prefix - the transaction prefix
   */

  /**
   * @memberof ETRXnetwork
   * @typedef PoolChanges
   * @property {ETRXnetwork.PoolChangesAdded} addedTxs - the recently added pool transactions
   * @property {string[]} deletedTxsIds - the transaction hashes of transactions removed from the pool
   * @property {boolean} isTailBlockActual - whether the tail block hash supplied is really the top
   * @property {string} status - the status of the request
   */

  /**
   * Returns updates regarding the transaction mempool
   * @async
   * @param {string} tailBlockHash - the last known block hash
   * @param {string[]} knownTransactionHashes - the transaction hashes that we know of
   * @returns {Promise<ETRXnetwork.PoolChanges>} resolves with pool change information or rejects with error
   */
  poolChanges (tailBlockHash, knownTransactionHashes) {
    return new Promise((resolve, reject) => {
      if (tailBlockHash === undefined) return reject(new Error('must supply a tail block hash'))
      if (!Array.isArray(knownTransactionHashes)) return reject(new Error('must supply an array of known transaction hashes'))

      var body = {
        tailBlockId: tailBlockHash,
        knownTxsIds: knownTransactionHashes
      }

      this._rawPost('get_pool_changes_lite', body).then((result) => {
        /* We need to clean up the response a bit */
        const tmp = []

        result.addedTxs.forEach((tx) => {
          tmp.push({
            hash: tx['transactionPrefixInfo.txHash'],
            prefix: tx['transactionPrefixInfo.txPrefix']
          })
        })

        result.addedTxs = tmp

        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * A Random Output
   * @memberof ETRXnetwork
   * @typedef {Object} RandomOutput
   * @property {number} global_amount_index - the output global index
   * @property {string} out_key - the output key
   */

  /**
   * A Random Outs object
   * @memberof ETRXnetwork
   * @typedef {Object} RandomOuts
   * @property {number} amount - the amount of the output
   * @property {ETRXnetwork.RandomOutput[]} outs - a list of random outputs
   */

  /**
   * Random Outputs Response
   * @memberof ETRXnetwork
   * @typedef {Object} RandomOutputsResponse
   * @property {ETRXnetwork.RandomOuts[]} outs - a list of random outs
   * @property {string} status - the response status
   */

  /**
   * Retrieves random outputs for mixing
   * @async
   * @param {number[]} amounts - the amounts that we need mixins for
   * @param {number} mixin - the number of mixins we need
   * @returns {Promise<ETRXnetwork.RandomOutputsResponse>} resolves with random outputs information or rejects with error
   */
  randomOutputs (opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {}
      if (!Array.isArray(opts.amounts)) return reject(new Error('must supply an array of amounts'))
      if (typeof opts.mixin === 'undefined') return reject(new Error('must supply a mixin value'))

      opts.mixin = parseInt(opts.mixin)
      if (isNaN(opts.mixin)) return reject(new Error('must supply a valid mixin value'))

      var body = {
        amounts: opts.amounts,
        outs_count: opts.mixin
      }

      this._rawPost('getrandom_outs', body).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * A Raw Transaction
   * @memberof ETRXnetwork
   * @typedef {Object} RawTransaction
   * @property {string} transaction - the raw transaction hex
   * @property {number} tx_size - the size of the transaction
   */

  /**
   * A Raw Block
   * @memberof ETRXnetwork
   * @typedef {Object} RawBlock
   * @property {string} block - the raw block hex
   * @property {number} block_size - the size of the block
   * @property {ETRXnetwork.RawTransaction[]} transactions - a list of raw transactions
   * @property {number} tx_count - the number of transactions in the block
   */

  /**
   * Get Blocks Fast Response
   * @memberof ETRXnetwork
   * @typedef {Object} RawBlocksResponse
   * @property {ETRXnetwork.RawBlock[]} blocks - the raw blocks
   * @property {number} current_height - the current height of the blockchain
   * @property {number} start_height - the starting height of the blocks in the response
   * @property {string} status - the response status
   */

  /**
   * Get raw blocks
   * @async
   * @param {string[]} blockHashes - first 10 blocks id goes sequential, next goes in pow(2,n) offset, like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block
   * @param {number} [blockCount] - the number of blocks to retrieve
   * @returns {Promise<ETRXnetwork.RawBlocksResponse>} resolves with raw blocks information or rejects with error
   */
  rawBlocks (blockHashes, blockCount) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(blockHashes)) return reject(new Error('must supply an array of block hashes'))
      if (blockCount && isNaN(blockCount)) return reject(new Error('block count must be a number'))

      const body = {
        block_ids: blockHashes
      }

      if (blockCount) {
        body.blockCount = Math.abs(blockCount)
      }

      this._rawPost('getblocks', body).then((result) => {
        /* We need to do a little bit of massaging here on this
           response because the daemon returns some funny
           business that we don't care for in JS */
        return resolve({
          blocks: result['response.blocks'],
          current_height: result['response.current_height'],
          start_height: result['response.start_height'],
          status: result['response.status']
        })
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Send Raw Transaction Response
   * @memberof ETRXnetwork
   * @typedef {Object} SendRawTransactionResponse
   * @property {string} status - the response status
   * @property {string} [error] - the error message if failed
   */

  /**
   * Sends a raw transaction to the daemon
   * @async
   * @param {string} transaction - the raw transaction
   * @returns {Promise<ETRXnetwork.SendRawTransactionResponse>} resolves with send raw transaction information or rejects with error
   */
  sendRawTransaction (transaction) {
    return new Promise((resolve, reject) => {
      if (!transaction) return reject(new Error('must specify raw serialized transaction'))

      this._rawPost('sendrawtransaction', {
        tx_as_hex: transaction
      }).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Submit Block Response
   * @memberof ETRXnetwork
   * @typedef {Object} SubmitBlockResponse
   * @property {string} status - the response status
   */

  /**
   * Sends a new block for the chain to the daemon
   * @async
   * @param {string} blockBlob - the raw block blob
   * @returns {Promise<ETRXnetwork.SubmitBlockResponse>} resolves with submit block response or rejects with error
   */
  submitBlock (blockBlob) {
    return new Promise((resolve, reject) => {
      if (!blockBlob) return reject(new Error('must specify blockBlob'))

      this._post('submitblock', [
        blockBlob
      ]).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * @memberof ETRXnetwork
   * @typedef VOUTTargetData
   * @property {string} key - the output target key
   */

  /**
   * @memberof ETRXnetwork
   * @typedef VOUTTarget
   * @property {ETRXnetwork.VOUTTargetData} data - output target data
   * @property {string} type - the output target type in hexadecimcal
   */

  /**
   * @memberof ETRXnetwork
   * @typedef VOUT
   * @property {number} amount - the amount of the output
   * @property {ETRXnetwork.VOUTTarget} target - the output target
   */

  /**
   * @memberof ETRXnetwork
   * @typedef VIN
   * @property {string} type - the type of the input in hexadecimcal
   * @property {Object} value - the input data
   * @property {number} value.amount - the input amount
   * @property {number} value.k_image - the input key image
   * @property {number[]} value.key_offsets - the input key offsets
   */

  /**
   * @memberof ETRXnetwork
   * @typedef VINCoinbase
   * @property {string} type - the input type in hexadecimcal
   * @property {Object} value - the input value
   * @property {number} value.height - the input height
   */

  /**
   * @memberof ETRXnetwork
   * @typedef TransactionPrefix
   * @property {string} extra - the transaction extra information as hexadecimcal
   * @property {number} unlock_time - the transaction unlock time
   * @property {number} version - the transaction version number
   * @property {ETRXnetwork.VINCoinbase|ETRXnetwork.VIN[]} vin - the transaction inputs
   * @property {ETRXnetwork.VOUT[]} vout - the transaction outputs
   */

  /**
   * @memberof ETRXnetwork
   * @typedef TransactionMetadata
   * @property {number} amount_out - the sum of the transaction outputs
   * @property {number} fee - the network fee of the transaction
   * @property {string} hash - the transaction hash
   * @property {number} mixin - the transaction ring size
   * @property {string} paymentId - the payment ID of the transaction if any
   * @property {number} size - the size of the transaction in bytes
   */

  /**
   * @memberof ETRXnetwork
   * @typedef TransactionResponse
   * @property {BlockShortHeader} block - the header of the block containing the transaction
   * @property {string} status - the status of the request
   * @property {ETRXnetwork.TransactionPrefix} tx - the transaction structured information
   * @property {ETRXnetwork.TransactionMetadata} txDetails - the transaction meta information
   */

  /**
   * Retrieves a single transaction's information
   * @async
   * @param {string} hash - the transaction hash
   * @returns {Promise<ETRXnetwork.TransactionResponse>} resolves with transaction response or rejects with error
   */
  transaction (hash) {
    return new Promise((resolve, reject) => {
      if (!hash) return reject(new Error('must specify hash'))

      this._post('f_transaction_json', {
        hash: hash
      }).then((result) => {
        if (result.tx && result.tx['']) delete result.tx['']
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Retrieves the summary information of the transactions in the mempool
   * @async
   * @returns {Promise<ETRXnetwork.TransactionSummary[]>} resolves with the transaction summaries or rejects with error
   */
  transactionPool () {
    return new Promise((resolve, reject) => {
      this._post('f_on_transactions_pool_json').then((result) => {
        return resolve(result.transactions)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * Transactions Status Response
   * @memberof ETRXnetwork
   * @typedef {Object} TransactionsStatusResponse
   * @property {string[]} transactionsInBlock - transaction hashes that are in blocks
   * @property {string[]} transactionsInPool - transaction hashes that are in the mempool
   * @property {string[]} transactionsUnknown - unknown transaction hashes
   */

  /**
   * Returns the status of the transaction hashes provided
   * @async
   * @param {string} transactionHashes - the transaction hashes to checked
   * @returns {Promise<ETRXnetwork.TransactionsStatusResponse>} resolves with the transactions statuses or rejects with error
   */
  transactionsStatus (opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {}

      if (!opts.transactionHashes) return reject(new Error('Must specify transaction hashes'))

      this._rawPost('get_transactions_status', {
        transactionHashes: opts.transactionHashes
      }).then((result) => {
        if (!result.status || !result.transactionsInPool || !result.transactionsInBlock || !result.transactionsUnknown) {
          return reject(new Error('Missing status or transactions key'))
        }
        if (result.status !== 'OK') {
          return reject(new Error('Status not OK'))
        }
        return resolve({
          transactionsInPool: result.transactionsInPool,
          transactionsInBlock: result.transactionsInBlock,
          transactionsUnknown: result.transactionsUnknown
        })
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  /**
   * @memberof ETRXnetwork
   * @typedef WalletSyncTransactionOutput
   * @property {number} amount - the output amount
   * @property {string} key - the output key
   */

  /**
   * @memberof ETRXnetwork
   * @typedef WalletSyncTransaction
   * @property {string} hash - the transaction hash
   * @property {ETRXnetwork.TransactionDetailInputKeyInput} [inputs] - the transaction inputs
   * @property {ETRXnetwork.WalletSyncTransactionOutput[]} outputs - the transaction outputs
   * @property {string} txPublicKey - the one-time public key of the transaction
   * @property {number} unlockTime - the unlock time (or block) of the transaction
   */

  /**
   * @memberof ETRXnetwork
   * @typedef WalletSyncDataBlock
   * @property {string} blockHash - the block hash
   * @property {number} blockHeight - the block height
   * @property {number} blockTimestamp - the block timestamp
   * @property {ETRXnetwork.WalletSyncTransaction} [coinbaseTX] - the block coinbase transaction
   * @property {ETRXnetwork.WalletSyncTransaction[]} transactions - the transactions in the block
   */

  /**
   * @memberof ETRXnetwork
   * @typedef WalletSyncDataTopBlock
   * @property {string} hash - the top block hash
   * @property {number} height - the top block height
   */

  /**
   * @memberof ETRXnetwork
   * @typedef WalletSyncDataResponse
   * @property {ETRXnetwork.WalletSyncDataBlock[]} items - block data array
   * @property {string} status - the reponse status message
   * @property {boolean} synced - whether the request is fully synched
   * @property {ETRXnetwork.WalletSyncDataTopBlock} [topBlock] - the top block information
   */

  /**
   * Returns up to 100 blocks. If block hash checkpoints are given, it will return beginning from the height of the first hash it finds, plus one.
   * However, if startHeight or startTimestamp is given, and this value is higher than the block hash checkpoints, it will start returning from that height instead.
   * The block hash checkpoints should be given with the highest block height hashes first.
   * Typical usage: specify a start height/timestamp initially, and from then on, also provide the returned block hashes.
   * @async
   * @param {Object} [opts] - the options to use when syncing
   * @param {number} [opts.startHeight=0] - the height to start from
   * @param {number} [opts.startTimestamp=0] - the timestamp to start from
   * @param {string[]} [opts.blockHashCheckpoints] - the block hash checkpoints
   * @param {boolean} [opts.skipCoinbaseTransactions=false] - whether to skip returning blocks with just coinbase transactions
   * @returns {Promise<ETRXnetwork.WalletSyncDataResponse>} resolves with sync data response or rejects with error
   */
  walletSyncData (opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {}

      if (typeof opts.startHeight === 'undefined') {
        opts.startHeight = 0
      }

      if (typeof opts.startTimestamp === 'undefined') {
        opts.startTimestamp = 0
      }

      if (!opts.blockHashCheckpoints) {
        opts.blockHashCheckpoints = {}
      }

      if (typeof opts.skipCoinbaseTransactions === 'undefined') {
        opts.skipCoinbaseTransactions = false
      }

      this._rawPost('getwalletsyncdata', {
        startHeight: opts.startHeight,
        startTimestamp: opts.startTimestamp,
        blockHashCheckpoints: opts.blockHashCheckpoints,
        skipCoinbaseTransactions: opts.skipCoinbaseTransactions
      }).then((result) => {
        if (!result.status || !result.items) {
          return reject(new Error('Missing items or status key'))
        }
        if (result.status !== 'OK') {
          return reject(new Error('Status not OK'))
        }
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }
}

module.exports = ETRXnetwork
