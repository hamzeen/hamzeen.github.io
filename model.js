angular.module('portApp', ['ngSanitize'])
    .controller('dataController', ['$scope', function($scope) {

        $scope.greet =
            'You have reached<br/> the portfolio of<br/> Hamzeen. H. ';

        $scope.aboutP1 =
            'Hamzeen is a software engineer and a practitioner of agile. ' +
        'He holds a bachelor\'s degree in Software Engineering with first class honours ' +
        'from University of Westminster, London & he thinks, \'math is art in disguise\'. ' +
            'His special interests include ubiquitous computing, augmented reality, ' +
            'physical computing, generative art & tangible interfaces.';

        $scope.aboutP2 =
            'Now, he counts over 5 years of experience in the industry and possesses expertise on ' +
        'multiple programming languages and SDKs including Java, Processing, Android, PHP and C++. ' +
        'In 2013, he also wrote the library \'ShortMessage\', for Processing Development Environment, ' +
        'in his leisure, he enjoys reading, blogging or playing table tennis.';


        $scope.paper1 =
            'Kin Wah Edward Lin, Hans Anderson, MHM Hamzeen, Simon Lui, (2014). ' +
        'Implementation and Evaluation of Real-Time Interactive User Interface Design ' +
        'in Self-learning Singing Pitch Training Apps. In proceedings of ICMC|SMC. ' +
            '(14-20 Sept 2014), Athens, Greece. ' +

                '<a href="http://speech.di.uoa.gr/ICMC-SMC-2014/images/VOL_2/1693.pdf" target="_blank">[http]</a><br/>';

        $scope.paper2 =
            'Hamzeen, H., and Perera, U., (2011). ' +
        'Pattern Independent Fiducial Marker Detection for an Interactive Public Display. ' +
            'In proceedings of International Conference on Advances in ICT for Emerging Regions. ' +
            '(1-2 Sept 2011), Colombo, Sri Lanka. ' +
                '<a href="http://dx.doi.org/10.1109/ICTer.2011.6075026" target="_blank">[http]</a><br/>';

        $scope.footer =
            'Copyright &copy; 2014 -2017 Hamzeen. H., handcrafted with care.';
    }]);
