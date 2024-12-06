


const { Get_Categories , Get_Categories_Option } = require("../utils/Categories.js");

const { Products } = require("../Models.js");

const Search = async ( req , res , next ) => {
    try {

        let Query_Type = req.query.Search_Type;
        Query_Type = Query_Type.toLowerCase();
        let Searched = req.query.Search;
        Searched = Searched.toLowerCase();



        
        if(Query_Type === "all"){
            Query_Type = null;

        }else{
            const Category = await Get_Categories(next);
            let Found = false;
            Category.forEach(element => {
                if (element.toLowerCase() === Query_Type) {
                    Found = true;
                };
            });
            if (!Found) {
                return res.status(404).render("404");
            };
        }

        if (Searched === "") {
            return res.status(404).render("404");
        };

        let List = [];
        
        // console.log(Searched);
        Searched = Searched.split(" ");
        if(Query_Type){
            let All_Products = await Products.find({
                Verified: "Yes",
                Categories: req.query.Search_Type,
            });
            
            All_Products.forEach(Product => {

                let Point = 0.1;
                let K = Product.Keywords.join(" ");

                let F = "";
                if( Product.Delivery == 0){
                    F = "Free";
                };

                let New_Line = Product._id + " " + Product.Title + " " + K + " " + Product.Brand + " " + F + " " + Product.Gender + " " + Product.Categories + " " + Product.Occasion;
                
                New_Line = New_Line.toLowerCase();
                New_Line = New_Line.split(" ");
                let Found = false;
                New_Line.forEach(element => {
                    Searched.forEach(element2 => {
                        if (element === element2) {
                            Point += 1.923 + element.length;
                            Found = true;
                        };
                        if(Point > 10){
                            let Cost = parseInt(element2, 10);
                            if ( Cost < Product.Price.MRP) {
                                Point += 1.9223;
                                Found = true;
                            }else if(Cost < Product.Price.Our_Price){
                                Point += 1.9923;
                                Found = true;
                            };
                        };
                    });
                });
                if (Found) {
                    List.push({
                        Point: Point,
                        _id: Product._id,
                    }); // -----------------------
                };
                

            });

        }else {

            let All_Products = await Products.find({
                Verified: "Yes",
            });
            
            All_Products.forEach(Product => {

                let Point = 0.1;
                let K = Product.Keywords.join(" ");

                let F = "";
                if( Product.Delivery == 0){
                    F = "Free";
                };

                let New_Line = Product._id + " " + Product.Title + " " + K + " " + Product.Brand + " " + F + " " + Product.Gender + " " + Product.Categories + " " + Product.Occasion;
                
                New_Line = New_Line.toLowerCase();
                New_Line = New_Line.split(" ");
                let Found = false;
                New_Line.forEach(element => {
                    Searched.forEach(element2 => {
                        if (element === element2) {
                            Point += 1.923 + element.length;
                            Found = true;
                        };
                        if(Point > 10){
                            let Cost = parseInt(element2, 10);
                            if ( Cost < Product.Price.MRP) {
                                Point += 1.9223;
                                Found = true;
                            }else if(Cost < Product.Price.Our_Price){
                                Point += 1.9923;
                                Found = true;
                            };
                        };
                    });
                });
                if (Found) {
                    List.push({
                        Point: Point,
                        _id: Product._id,
                    }); // -----------------------
                };
                

            });
            
        };

        List = List.sort((a, b) => b.Point - a.Point);

        console.log(List);

        
        let Got_User = req.User;
        if(Got_User){
            res.status(200).render('Search', {
                Search_Value: req.query.Search,
                
                Get_Categories_Option : await Get_Categories_Option(next),
                CartNumber:Got_User.Cart.length,
                Login:"",
                Logout: `<a title="Logout" href="/api/v1/auth/logout">Logout</a>`,
            });

        }else{
            res.status(200).render('Search', {
                Search_Value: req.query.Search,
                Get_Categories_Option : await Get_Categories_Option(next),
                CartNumber:0,
                Logout:"",
                Login: `<a title="Login" href="/auth/login">Login</a>`,
            });
        };
    } catch (err) {
        next(err);
    };
};

module.exports = Search;