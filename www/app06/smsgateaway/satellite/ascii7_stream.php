<?php

set_time_limit(5);
ini_set('memory_limit', '8M');

//////////////////////////////////////////////////////
//
//  Echo functions
//
$out = '';
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="color:#7595AF; font-size:1.4em; margin:4em 2em 1em 2em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="color:#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function html($content) {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 


		$s = '
				body { font-size:120%; margin: 2em;}
				.pincell { border:1px solid pink; border-radius:.2em; color:red; }
				.selected { border-color:red; background:red; color:white; }
				.scorecell { border:1px solid pink; line-height:2em; color:grey; padding:0 1em; }
			';

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			$o .= '<link href="./utilities/visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<style>'.$s.'</style>';
			$o .= '</head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}


$out .= h1('a s c i i 7 ');






function bit7_chop($bytes, $o = 0) { // turn an ascii7 stream into a serie of bytes each with a value 0-127 matching an ascii7 table character

	// $o = offset, nbr of bits to ignore at the beginning of the chain

	$cut7 = 127; 		// base_convert('000000000000000001111111', 2, 10);
	$mask  = 65408; 	// base_convert('111111111111111110000000', 2, 10);
	$rest = 0; $s = 0;
	$xtr = Array(); 	// 
	foreach($bytes as $x => $b) {
		$sum = ( $b << ($s) ) | $rest; 
		$xtr[] = ( $sum & ($cut7<<$o)) >> $o; // cut the 7 least significant bits
		$rest = ($sum & ($mask<<$o)) >> (7+$o); // move the highest zootjes to the right
		$s++; $s-=$o;
		$o = 0; // offset applies only once at the beginning of the chain
		if($s==7) { $xtr[] = $rest; $s = 0; $rest = 0; };
	}
	return $xtr;
}


function bit7_stream($ascii7, $o = 0) { // packs an ascii7 array of bytes into a 7 bits stream, each most significant bit removed

	// $ascii7 is an array of bytes with each a value 0-127, representing an alphanum string as per ascii7 character table
	// $o = offset, nbr of bits to insert at the beginning of the bitstream (least significant bit)

	$cut7 = 127; 		// base_convert('000000000000000001111111', 2, 10);
	$cut8 = 255; 		// base_convert('000000000000000011111111', 2, 10);
	$mask  = 16776960; 	// base_convert('111111111111111100000000', 2, 10);
	$reg = 0; // normally, each of the input byte has a 0 highest significant bit, but we make this suer by cutting it anyway
	$s = 8; // s = shift increment
	$str = Array(); 	// output stream
	foreach($ascii7 as $x => $b) {
		$b = $b & $cut7; // normally, each of the input byte has a 0 highest significant bit, but we make this sure by cutting it anyway
		if($s==8) { 
			$reg = $b<<$o; $s--; 
			if($o) { $str[] = $reg; $s = 9 - $o; $o = 0; }
			continue; 
		} 
		$sum = ( $b << $s ) | $reg; 
		$str[] = $sum & $cut8;
		$reg = ($sum & $mask) >> 8; // move the highest zootjes to the right
		$s--; if($s==0) { $s = 8; $reg = 0; };
	}
	if($s!=8) $str[] = $reg;
	return $str;
}



// see https://www.developershome.com/sms/gsmAlphabet.asp  for conversion to UTF-8 




if(1) {

	$out .= h1('Test 1 - no offset');

	// This is the data as received from the Serial port (hex format, little endian host format)
	// 
	$le_bytes_hex = Array( '61', 'F1', '98', '5C', '36', '9F', 'D1', '69', 'F5', '9A', 'DD', '76', 'BF', 'E1', '71', 'F9', '9C', '5E', 'B7', 'DF', 'F1', '79', '3D' ); 


	// Same data in decimal value, each value ranges [0-255]
	//
	$le_bytes_dec = Array(); foreach($le_bytes_hex as $x => $hex) $le_bytes_dec[] = hexdec($hex);

	$out .= h2('Original set : (offset = 0)');

		$display = '0x'.implode(' - 0x',$le_bytes_hex);
	$out .= notice($display);
		$display = 'decimal: '.implode(' - ',$le_bytes_dec);
	$out .= notice($display);

	$out .= h2('Ascii7 values : ');

	$chop = bit7_chop($le_bytes_dec);
		$display = implode(', ',$chop);
	$out .= warning($display);


	$out .= h2('streamed set : ');

	$streamed = bit7_stream($chop);
		$display = 'decimal: '.implode(' - ',$streamed);
	$out .= notice($display);

}



$out .= h1('Test 2, offset = 1');

// This is the data as received from the Serial port (hex format, little endian host format)
// 


$le_bytes_hex = Array('C2', 'E1', '42', '21', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38'
, '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3'
, 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C'
, '0E', '87', 'C3', 'E1', '70', '38', 'AC', '0F', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1'
, '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E', 'EB', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3', 'E1', '70', '38', '1C', '0E'
, '87', 'C3', 'E1', '70', '38', '1C', '0E', '87', 'C3' ); 

$out .= h2('Original set : (offset = 1)');

// Same data in decimal value, each value ranges [0-255]
//
$le_bytes_dec = Array(); foreach($le_bytes_hex as $x => $hex) $le_bytes_dec[] = hexdec($hex);

	$display = '0x'.implode(' - 0x',$le_bytes_hex);
$out .= notice($display);
	$display = 'decimal: '.implode(' - ',$le_bytes_dec);
$out .= notice($display);



$out .= h2('Ascii7 values : ');

$chop = bit7_chop($le_bytes_dec, 1);
	$display = implode(', ',$chop);
$out .= warning($display);


$out .= h2('streamed set : ');

$streamed = bit7_stream($chop, 1);
	$display = 'decimal: '.implode(' - ',$streamed);
$out .= notice($display);






$out .= h1('Test 3 ');



// This is the data as received from the Serial port (hex format, little endian host format)
// 
$le_bytes_hex = Array( '61', 'F1', '98', '5C', '36', '9F', 'D1', '69', '35' ); 


// Same data in decimal value, each value ranges [0-255]
//
$le_bytes_dec = Array(); foreach($le_bytes_hex as $x => $hex) $le_bytes_dec[] = hexdec($hex);



$chop = bit7_chop($le_bytes_dec);
	$display = implode(', ',$chop);
$out .= warning($display);






$out .= h1('Test 4 ');



// This is the data as received from the Serial port (hex format, little endian host format)
// 
$le_bytes_hex = Array( '61' ); 


// Same data in decimal value, each value ranges [0-255]
//
$le_bytes_dec = Array(); foreach($le_bytes_hex as $x => $hex) $le_bytes_dec[] = hexdec($hex);



$chop = bit7_chop($le_bytes_dec);
	$display = implode(', ',$chop);
$out .= warning($display);





// @

// At sign

// 0

// 00

// 64

// 40



// £

// Pound sign

// 1

// 01

// 163

// A3



// $

// Dollar sign

// 2

// 02

// 36

// 24

// ¥

// Yuan/Yen sign

// 3

// 03

// 165

// A5

// è

// Small letter e with grave accent

// 4

// 04

// 232

// E8

// é

// Small letter e with acute accent

// 5

// 05

// 233

// E9

// ù

// Small letter u with grave accent

// 6

// 06

// 249

// F9

// ì

// Small letter i with grave accent

// 7

// 07

// 236

// EC

// ò

// Small letter o with grave accent

// 8

// 08

// 242

// F2

// Ç

// Capital letter C with cedilla

// 9

// 09

// 199

// C7


// Linefeed

// 10

// 0A

// 10

// 0A

// Ø

// Capital letter O with stroke

// 11

// 0B

// 216

// D8

// ø

// Small letter o with stroke

// 12

// 0C

// 248

// F8


// Carriage return

// 13

// 0D

// 13

// 0D

// Å

// Capital letter A with ring

// 14

// 0E

// 197

// C5

// å

// Small letter a with ring

// 15

// 0F

// 229

// E5

// Δ

// Capital letter Greek delta

// 16

// 10



// _

// Underscore

// 17

// 11

// 95

// 5F

// Φ

// Capital letter Greek phi

// 18

// 12



// Γ

// Capital letter Greek gamma

// 19

// 13



// Λ

// Capital letter Greek lambda

// 20

// 14



// Ω

// Capital letter Greek omega

// 21

// 15



// Π

// Capital letter Greek pi

// 22

// 16



// Ψ

// Capital letter Greek psi

// 23

// 17



// Σ

// Capital letter Greek sigma

// 24

// 18



// Θ

// Capital letter Greek theta

// 25

// 19



// Ξ

// Capital letter Greek xi

// 26

// 1A




// Escape

// 27

// 1B




// Form feed

// 27 10

// 1B0A

// 12

// 0C

// ^

// Caret / Circumflex

// 27 20

// 1B14

// 94

// 5E

// {

// Left curly bracket

// 27 40

// 1B28

// 123

// 7B

// }

// Right curly bracket

// 27 41

// 1B29

// 125

// 7D

// \

// Backslash

// 27 47

// 1B2F

// 92

// 5C

// [

// Left square bracket

// 27 60

// 1B3C

// 91

// 5B

// ~

// Tilde

// 27 61

// 1B3D

// 126

// 7E

// ]

// Right square bracket

// 27 62

// 1B3E

// 93

// 5D

// |

// Vertical bar

// 27 64

// 1B40

// 124

// 7C

// €

// Euro sign

// 27 101

// 1B65



// Æ

// Capital letter AE

// 28

// 1C

// 198

// C6

// æ

// Small letter ae

// 29

// 1D

// 230

// E6

// ß

// Small letter German Eszett

// 30

// 1E

// 223

// DF

// É

// Capital letter E with acute accent

// 31

// 1F

// 201

// C9


// Space

// 32

// 20

// 32

// 20

// !

// Exclamation mark

// 33

// 21

// 33

// 21

// "

// Quotation mark

// 34

// 22

// 34

// 22

// #

// Number sign

// 35

// 23

// 35

// 23

// ¤

// Currency sign

// 36

// 24

// 164

// A4

// %

// Percent sign

// 37

// 25

// 37

// 25

// &

// Ampersand

// 38

// 26

// 38

// 26

// '

// Apostrophe

// 39

// 27

// 39

// 27

// (

// Left parenthesis

// 40

// 28

// 40

// 28

// )

// Right parenthesis

// 41

// 29

// 41

// 29

// *

// Asterisk

// 42

// 2A

// 42

// 2A

// +

// Plus sign

// 43

// 2B

// 43

// 2B

// ,

// Comma

// 44

// 2C

// 44

// 2C

// -

// Minus sign / Hyphen

// 45

// 2D

// 45

// 2D

// .

// Full stop / Period

// 46

// 2E

// 46

// 2E

// /

// Slash

// 47

// 2F

// 47

// 2F

// 0

// Digit zero

// 48

// 30

// 48

// 30

// 1

// Digit one

// 49

// 31

// 49

// 31

// 2

// Digit two

// 50

// 32

// 50

// 32

// 3

// Digit three

// 51

// 33

// 51

// 33

// 4

// Digit four

// 52

// 34

// 52

// 34

// 5

// Digit five

// 53

// 35

// 53

// 35

// 6

// Digit six

// 54

// 36

// 54

// 36

// 7

// Digit seven

// 55

// 37

// 55

// 37

// 8

// Digit eight

// 56

// 38

// 56

// 38

// 9

// Digit nine

// 57

// 39

// 57

// 39

// :

// Colon

// 58

// 3A

// 58

// 3A

// ;

// Semicolon

// 59

// 3B

// 59

// 3B

// <

// Less-than sign

// 60

// 3C

// 60

// 3C

// =

// Equals sign

// 61

// 3D

// 61

// 3D

// >

// Greater-than sign

// 62

// 3E

// 62

// 3E

// ?

// Question mark

// 63

// 3F

// 63

// 3F

// ¡

// Inverted exclamation mark

// 64

// 40

// 161

// A1

// A

// Capital letter A

// 65

// 41

// 65

// 41

// B

// Capital letter B

// 66

// 42

// 66

// 42

// C

// Capital letter C

// 67

// 43

// 67

// 43

// D

// Capital letter D

// 68

// 44

// 68

// 44

// E

// Capital letter E

// 69

// 45

// 69

// 45

// F

// Capital letter F

// 70

// 46

// 70

// 46

// G

// Capital letter G

// 71

// 47

// 71

// 47

// H

// Capital letter H

// 72

// 48

// 72

// 48

// I

// Capital letter I

// 73

// 49

// 73

// 49

// J

// Capital letter J

// 74

// 4A

// 74

// 4A

// K

// Capital letter K

// 75

// 4B

// 75

// 4B

// L

// Capital letter L

// 76

// 4C

// 76

// 4C

// M

// Capital letter M

// 77

// 4D

// 77

// 4D

// N

// Capital letter N

// 78

// 4E

// 78

// 4E

// O

// Capital letter O

// 79

// 4F

// 79

// 4F

// P

// Capital letter P

// 80

// 50

// 80

// 50

// Q

// Capital letter Q

// 81

// 51

// 81

// 51

// R

// Capital letter R

// 82

// 52

// 82

// 52

// S

// Capital letter S

// 83

// 53

// 83

// 53

// T

// Capital letter T

// 84

// 54

// 84

// 54

// U

// Capital letter U

// 85

// 55

// 85

// 55

// V

// Capital letter V

// 86

// 56

// 86

// 56

// W

// Capital letter W

// 87

// 57

// 87

// 57

// X

// Capital letter X

// 88

// 58

// 88

// 58

// Y

// Capital letter Y

// 89

// 59

// 89

// 59

// Z

// Capital letter Z

// 90

// 5A

// 90

// 5A

// Ä

// Capital letter A with diaeresis

// 91

// 5B

// 196

// C4

// Ö

// Capital letter O with diaeresis

// 92

// 5C

// 214

// D6

// Ñ

// Capital letter N with tilde

// 93

// 5D

// 209

// D1

// Ü

// Capital letter U with diaeresis

// 94

// 5E

// 220

// DC

// §

// Section sign

// 95

// 5F

// 167

// A7

// ¿

// Inverted question mark

// 96

// 60

// 191

// BF

// a

// Small letter a

// 97

// 61

// 97

// 61

// b

// Small letter b

// 98

// 62

// 98

// 62

// c

// Small letter c

// 99

// 63

// 99

// 63

// d

// Small letter d

// 100

// 64

// 100

// 64

// e

// Small letter e

// 101

// 65

// 101

// 65

// f

// Small letter f

// 102

// 66

// 102

// 66

// g

// Small letter g

// 103

// 67

// 103

// 67

// h

// Small letter h

// 104

// 68

// 104

// 68

// i

// Small letter i

// 105

// 69

// 105

// 69

// j

// Small letter j

// 106

// 6A

// 106

// 6A

// k

// Small letter k

// 107

// 6B

// 107

// 6B

// l

// Small letter l

// 108

// 6C

// 108

// 6C

// m

// Small letter m

// 109

// 6D

// 109

// 6D

// n

// Small letter n

// 110

// 6E

// 110

// 6E

// o

// Small letter o

// 111

// 6F

// 111

// 6F

// p

// Small letter p

// 112

// 70

// 112

// 70

// q

// Small letter q

// 113

// 71

// 113

// 71

// r

// Small letter r

// 114

// 72

// 114

// 72

// s

// Small letter s

// 115

// 73

// 115

// 73

// t

// Small letter t

// 116

// 74

// 116

// 74

// u

// Small letter u

// 117

// 75

// 117

// 75

// v

// Small letter v

// 118

// 76

// 118

// 76

// w

// Small letter w

// 119

// 77

// 119

// 77

// x

// Small letter x

// 120

// 78

// 120

// 78

// y

// Small letter y

// 121

// 79

// 121

// 79

// z

// Small letter z

// 122

// 7A

// 122

// 7A

// ä

// Small letter a with diaeresis

// 123

// 7B

// 228

// E4

// ö

// Small letter o with diaeresis

// 124

// 7C

// 246

// F6

// ñ

// Small letter n with tilde

// 125

// 7D

// 241

// F1

// ü

// Small letter u with diaeresis

// 126

// 7E

// 252

// FC

// à

// Small letter a with grave accent

// 127

// 7F

// 224

// E0









































echo html($out);
?>