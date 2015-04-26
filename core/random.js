
function Core(){}

/**
 * Returns a random integer between two values, inclusive.
 * 
 * @param 	low	minimum value to generate 
 * @param 	high	maximum value to generate
 * @return 		generated number
 */
Core.RNR = function(low, high)
{
    if (high >=0)
	high = Math.floor(high);
    else
	high = Math.ceil(high);
    if (low >=0)
	low = Math.floor(low);
    else
	low = Math.ceil(low);
    var a = Math.round(Math.random()*high)+low;
    if (a > high)
	a = high;
    if (a < low)
	a = low;
    return a;
};