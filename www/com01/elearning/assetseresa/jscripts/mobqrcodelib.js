
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   Q R C O D E    D I S P L A Y 
//
//      https://larsjung.de/jquery-qrcode/
//      https://github.com/lrsjng/kjua/issues/22
//      https://larsjung.de/jquery-qrcode/
//      https://www.codehim.com/others/javascript-qr-code-generator-with-logo-jquery-qrcode/
//      https://larsjung.de/jquery-qrcode/latest/demo/
//      https://www.qrcode.com/en/about/version.html
//
//      constructor parameters
//      ======================
//      - control : div tag id
//      - qrcodesize: qrcode size in pixel
//      - imageurl: logo url or null (default=null)
//      - radius: corner radius relative to module width: 0.0 .. 0.5 (default=0.0)
//      - logosize : logo size in percent : 0.00 .. 0.40 (default = 0.3)
//      - error correction level: 'L', 'M', 'Q' or 'H' (default = Q)
//      - minsymbolversion :The symbol versions of QR Code, 1 .. 40 (default=5) (max version has been fixed to 40)
//
class e_QRcode
{
    constructor (control,qrcodesize,imageurl=null,radius=0.0,logosize=0.3,correctionlevel='Q',minsymbolversion=5) {
        this.control = control;
        this.qrcodesize = qrcodesize;
        this.imageurl = imageurl;
        this.radius = radius;
        this.logosize = logosize;
        this.correctionlevel = correctionlevel;
        this.minsymbolversion = minsymbolversion;
    }


    //public methods---------------------------------------------------------------------

    //input : content = qrcode string
    display(content) 
    {
        //create image from url file
        if (this.imageurl!=null)
        {
            let imagebuffer = new Image;
            imagebuffer.src = this.imageurl;
            
            //wait onload event for generating qrcode
            let self = this;
            imagebuffer.onload = function() {
                self.internaldisplay(imagebuffer,content,4);
            }
        }
        else
        {
            this.internaldisplay(null,content,0);
        }
    }
    
    //private methods---------------------------------------------------------------------
    internaldisplay (imagebuffer,content,mode)
    {
        let options = {
            // render method: 'canvas', 'image' or 'div'
            render: 'image',
        
            // version range somewhere in 1 .. 40
            minVersion: this.minsymbolversion,
            maxVersion: 40,
        
            // error correction level: 'L', 'M', 'Q' or 'H'
            ecLevel: this.correctionlevel,
        
            // offset in pixel if drawn onto existing canvas
            left: 0,
            top: 0,
        
            // size in pixel
            size: this.qrcodesize,
        
            // code color or image element
            fill: '#000',
        
            // background color or image element, null for transparent background
            background: null,
        
            // content
            text: content,
        
            // corner radius relative to module width: 0.0 .. 0.5
            radius: this.radius,
        
            // quiet zone in modules
            quiet: 0,
        
            // modes
            // 0: normal
            // 1: label strip
            // 2: label box
            // 3: image strip
            // 4: image box
            mode: mode,
        
            // logo size (percent)
            mSize: this.logosize,
            // logo position (percent)
            mPosX: 0.5,
            mPosY: 0.5,
        
            label: 'no label',
            fontname: 'sans',
            fontcolor: '#000',
            image: imagebuffer
        };

        $(this.control).qrcode(options);
    }

};