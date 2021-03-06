let mongoose = require( 'mongoose' );
let respondToRequest = require( '../route/util/respondToRequest' );

let InstallSchema = mongoose.Schema( {

  install_num: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  install_type: {
    type: String,
    enum: [
      'undefined',
      'ic',
      'c_mc',
      'c_rf',
      'c_rp'
    ]
  },

  creator: String,
  worked_on: [ String ],

  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },

  // Branching Element
  able_to_complete: Boolean,

  // Unable to install
  problem_image: String,
  problem_notes: String,

  // Able to install
  before_install_image: String,
  before_install_valve_pos: {
    type: String,
    enum: [ 'on', 'off' ]
  },

  // Branching Element
  job_type: {
    type: String,
    enum: [ 'mc', 'rf', 'rp' ]
  },

  // Meter Change
  mc_new_meter_sn: String,
  mc_new_meter_sn_image: String,
  mc_transmitter_sn: String,
  mc_transmitter_sn_image: String,
  mc_meter_size: String,
  mc_old_meter_read_out: String,
  mc_old_meter_read_out_image: String,
  mc_flow_direction: {
    type: String,
    enum: [ 'yes', 'no' ]
  },
  mc_post_install_image: String,
  mc_post_install_valve_position: {
    type: String,
    enum: [ 'on', 'off' ]
  },

  // Retrofit
  rf_old_serial_number: String,
  rf_new_transmitter_number: String,
  rt_transmitter_install_image: String,
  rf_outread_image: String,
  tf_outread_type: String,

  // Repair
  rp_number_of_workers: Number,
  rp_time_spent: String,
  rp_image: String,
  rp_notes: String,

  notes: String
} );

let Install = module.exports = mongoose.model( 'install', InstallSchema );

module.exports.createNewInstall = function ( googleId, newInstallData, callback ) {

  if ( !newInstallData.install_num ) {
    callback( {
      code: respondToRequest.errorCodes.dataMalformed,
      message: "Need at least a creating user and install number to create new install.",
      data: newInstallData
    } );
    return;
  }

  newInstallData[ "creator" ] = googleId;
  newInstallData[ "worked_on" ] = [ googleId ];

  Install.create( newInstallData, callback );

};


module.exports.upsert = function( googleId, installData, callback ) {

  if ( !installData.install_num ) {
    callback( {
      code: respondToRequest.errorCodes.dataMalformed,
      message: "Need at least a creating user and install number to create new install.",
      data: installData
    } );
    return;
  }

  let query = {
    install_num: installData.install_num
  };

  let options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };

  Install.findOneAndUpdate( query, installData, options, callback );
};


module.exports.findByInstallNum = function( install_num, callback ) {

  let query = {
    install_num: install_num
  };

  Install.findOne( query, callback );

};


module.exports.findAllCreatedByUser = function( googleId, callback ) {

  let query = {
    creator: googleId
  };

  Install.find( query, callback );
};


module.exports.findAll = function( callback ) {

  Install.find( callback );

};