


const Home = async (req, res, next) => {
    
    res.render('Home', {
        title: 'Home',
        Project_URL: "Project_URL",
    });
};
module.exports = Home;