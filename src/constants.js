NIO.utils.extendGlobal('NIO.constants', {
	
    environment: (function() {
        var environments = {
            local: ['127.0.0.1', 'localhost', 'test'],
            dev: [''],
            stage: ['']
        };

        for (var key in environments) {
            for (iterator = 0; iterator < environments[key].length; iterator++) {
                if (window.location.href.match(environments[key][iterator])) {
                    return key;
                }
            }
        }

        return 'prod';
    })(),

    scrollBarWidth: (function () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild (inner);

        // TODO: remove this conditional when all of the js is loaded at the end of the DOM
        if (!document.body) {
            return false;
        }

        document.body.appendChild (outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild (outer);

        return (w1 - w2);
    })(),

    currentHost: (function() {
        return window.location.host.replace('www.','');
    })(),

    CAProvinces: [
        {value: 'ON', label: 'Ontario'},
        {value: 'QC', label: 'Quebec'},
        {value: 'NS', label: 'Nova Scotia'},
        {value: 'NB', label: 'New Brunswick'},
        {value: 'MB', label: 'Manitoba'},
        {value: 'BC', label: 'British Columbia'},
        {value: 'PE', label: 'Prince Edward Island'},
        {value: 'SK', label: 'Saskatchewan'},
        {value: 'AB', label: 'Alberta'},
        {value: 'NL', label: 'Newfoundland and Labrador'}
    ],

    USStates: [
        {value: 'AL', label: 'Alabama'},
        {value: 'AK', label: 'Alaska'},
        {value: 'AZ', label: 'Arizona'},
        {value: 'AR', label: 'Arkansas'},
        {value: 'CA', label: 'California'},
        {value: 'CO', label: 'Colorado'},
        {value: 'CT', label: 'Connecticut'},
        {value: 'DC', label: 'District of Columbia'},
        {value: 'DE', label: 'Delaware'},
        {value: 'FL', label: 'Florida'},
        {value: 'GA', label: 'Georgia'},
        {value: 'HI', label: 'Hawaii'},
        {value: 'ID', label: 'Idaho'},
        {value: 'IL', label: 'Illinois'},
        {value: 'IN', label: 'Indiana'},
        {value: 'IA', label: 'Iowa'},
        {value: 'KS', label: 'Kansas'},
        {value: 'KY', label: 'Kentucky'},
        {value: 'LA', label: 'Louisiana'},
        {value: 'ME', label: 'Maine'},
        {value: 'MD', label: 'Maryland'},
        {value: 'MA', label: 'Massachusetts'},
        {value: 'MI', label: 'Michigan'},
        {value: 'MN', label: 'Minnesota'},
        {value: 'MS', label: 'Mississippi'},
        {value: 'MO', label: 'Missouri'},
        {value: 'MT', label: 'Montana'},
        {value: 'NE', label: 'Nebraska'},
        {value: 'NV', label: 'Nevada'},
        {value: 'NH', label: 'New Hampshire'},
        {value: 'NJ', label: 'New Jersey'},
        {value: 'NM', label: 'New Mexico'},
        {value: 'NY', label: 'New York'},
        {value: 'NC', label: 'North Carolina'},
        {value: 'ND', label: 'North Dakota'},
        {value: 'OH', label: 'Ohio'},
        {value: 'OK', label: 'Oklahoma'},
        {value: 'OR', label: 'Oregon'},
        {value: 'PA', label: 'Pennsylvania'},
        {value: 'RI', label: 'Rhode Island'},
        {value: 'SC', label: 'South Carolina'},
        {value: 'SD', label: 'South Dakota'},
        {value: 'TN', label: 'Tennessee'},
        {value: 'TX', label: 'Texas'},
        {value: 'UT', label: 'Utah'},
        {value: 'VT', label: 'Vermont'},
        {value: 'VA', label: 'Virginia'},
        {value: 'WA', label: 'Washington'},
        {value: 'WV', label: 'West Virginia'},
        {value: 'WI', label: 'Wisconsin'},
        {value: 'WY', label: 'Wyoming'}
    ],

    ISDCodes: [
        {value: '001', label: 'United States'},
        {value: '027', label: 'South Africa'},
        {value: '033', label: 'France'},
        {value: '039', label: 'Italy'},
        {value: '041', label: 'Switzerland'},
        {value: '044', label: 'Great Britain'},
        {value: '049', label: 'Germany'},
        {value: '052', label: 'Mexico'},
        {value: '055', label: 'Brazil'},
        {value: '061', label: 'Australia'},
        {value: '086', label: 'China'},
        {value: '000', label: 'Other'}
    ]

});
