exports.convertParams = function (paramsToConvert) {
  var str = ' { ';
  var initial = str;
  const COMA = ', ';
  
  //TODO: Think about this
  // for (var key in paramsToConvert) {
  //   if (key == "minPrice") {
  //   }
  // }

  // Rent or Buy
  if (paramsToConvert.buy && paramsToConvert.rent) {
    str += '"$or" : [ { "type" : "buy" }, { "type" : "rent" } ]';
  }
  else if (paramsToConvert.buy) {
    str += '"type" : "buy"';
  }
  else if (paramsToConvert.rent) {
    str += '"type" : "rent"';
  }

  // Bathrooms
  if (paramsToConvert.bathrooms != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"bathrooms" : ' + paramsToConvert.bathrooms;
  }

  // Property Type
  if (paramsToConvert.tipology != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"tipology" : "' + paramsToConvert.tipology + '"';
  }

  // Area
  if (paramsToConvert.minArea != null && paramsToConvert.maxArea != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"area" : { "$gte" : ' + paramsToConvert.minArea + ', "$lte" : ' + paramsToConvert.maxArea + ' }';
  }
  else if (paramsToConvert.minArea != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"area" : { "$gte" : ' + paramsToConvert.minArea + ' }';
  }
  else if (paramsToConvert.maxArea != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"area" : { "$lte" : ' + paramsToConvert.maxArea + ' }';
  }

  // Price
  if (paramsToConvert.minPrice != null && paramsToConvert.maxPrice != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"price" : { "$gte" : ' + paramsToConvert.minPrice + ', "$lte" : ' + paramsToConvert.maxPrice + ' }';
  }
  else if (paramsToConvert.minPrice != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"price" : { "$gte" : ' + paramsToConvert.minPrice + ' }';
  }
  else if (paramsToConvert.maxPrice != null) {
    if (str != initial) {
      str += COMA;
    }
    str += '"price" : { "$lte" : ' + paramsToConvert.maxPrice + ' }';
  }

  str += ' }';
  console.log(str)

  return JSON.parse(str);
}

/**
 * Example of paramsToConvert
 */
// {
// 	"rent" : false,
// 	"buy" : true,
// 	"tipology" : "T1",
// 	"minArea"  : null,
// 	"maxArea" : 1332,
// 	"minPrice" : null,
// 	"maxPrice" : 123,
// 	"hospital" : false,
// 	"school" : false,
// 	"shopping" : false,
// 	"transport" : false
// }