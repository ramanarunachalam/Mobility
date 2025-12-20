const LANG_PARAMS = [ 'English', 'English' ];
const HISTORY_TITLE = 'BMTC';

const SEARCH_TOOLTIP = 'Prefix Search <br/> e.g. shiva bus <br/> Phonetic Search <br/> e.g. jivaji <br/> Language Search <br/> e.g. <br/> Context Search <br/> e.g. shivaji : 112';
const MIC_TOOLTIP = 'Only in Chrome';
const KBD_TOOLTIP = 'Language Keyboard';

const VIDEO_INFO_KEY_LIST = new Set([ 'title', 'author_name' ]);

const CATEGORY_DICT = { 'categories' : [ { 'C' : 'busstop',    'I' : 'signpost',    'N' : 'Bus Stop'   },
                                         { 'C' : 'busroute',   'I' : 'repeat',      'N' : 'Bus Route' },
                                         { 'C' : 'nammametro', 'I' : 'train-front', 'N' : 'Namma Metro' },
                                         { 'C' : 'about',      'I' : 'info-circle', 'N' : 'About'    },
                                       ]
                      };

const START_NAV_CATEGORY = 'busstop';

LINK_ACTIVE_BUTTON = 2

const MENU_ICON_DICT = {};

const IMP_COUNT        = 1;

const SEARCH_MAP_DICT = { 'c' : 's', 'p' : 'b' };

VIEW_IN_LANDSCAPE_MSG = [ 'Best Viewed in Landscape Mode', 'Use Landscape Mode' ];
VIDEO_NOT_PLAYING_MSG = [ 'Video is not playable', 'Click Play List to Delete Song' ];

const BANGALORE_LAT    = 12.97729;
const BANGALORE_LONG   = 77.59973;
const BANGALORE_CENTER = [ BANGALORE_LAT, BANGALORE_LONG ];
const BANGALORE_BBOX   = '77.299805,12.762250,77.879333,13.170423';

const OSM_TILE_URL     = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_BUILDING_URL = 'https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json';
const OSM_ATTR_URL     = 'https://www.openstreetmap.org/copyright';
const OSM_ATTRIBUTION  = `&copy; <a href="${OSM_ATTR_URL}">OpenStreetMap</a>`;

const MIN_ZOOM         = 12;
const AREA_MIN_ZOOM    = 16;
const DEFAULT_ZOOM     = 18;
const MAX_ZOOM         = 21;

const TILE_OPTIONS = {
    attribution: OSM_ATTRIBUTION,
    subdomains: ['a', 'b', 'c'],
    maxNativeZoom: DEFAULT_ZOOM,
    maxZoom: MAX_ZOOM
};

function sleep(seconds){
    const waitUntil = new Date().getTime() + seconds*1000;
    while(new Date().getTime() < waitUntil) true;
}

function capitalize_word(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function get_yt_image(image) {
    return `https://i.ytimg.com/vi/${image}.jpg`;
}

async function fetch_url(url) {
    let url_data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log('Fetch Error:', response.status);
        }
        url_data = await response.json();
    } catch(error) {
        console.log('Fetch Error:', error, url);
    }
    return url_data;
}

function get_bs_modal(id) {
    return new bootstrap.Modal(document.getElementById(id));
}

function plain_get_html_text(id) {
    return document.getElementById(id).innerHTML;
}

function plain_set_html_text(id, text) {
    document.getElementById(id).innerHTML = text;
}

function plain_add_class(id, name) {
    const element = document.getElementById(id);
    element.classList.add(name);
}

function plain_remove_class(id, name) {
    const element = document.getElementById(id);
    element.classList.remove(name);
}

function plain_get_attr(id, key) {
    const element = document.getElementById(id);
    return element.getAttribute(key);
}

function plain_set_attr(id, key, value) {
    const element = document.getElementById(id);
    element.setAttribute(key, value);
}

function plain_get_background_color(id) {
    const element = document.getElementById(id);
    return element.style.backgroundColor;
}

function plain_set_background_color(id, value) {
    let element = document.getElementById(id);
    element.style.backgroundColor = value;
}

function plain_get_query_selector(phrase) {
    return document.querySelectorAll(phrase);
}

function call_modal_dialog(title) {
    plain_set_html_text('DIALOG_TITLE', title);
    get_bs_modal('DIALOG_BOX').show();
}

function show_modal_dialog(title, body) {
    plain_set_html_text('DIALOG_BODY', body);
    call_modal_dialog(title);
    setTimeout(function() { get_bs_modal('DIALOG_BOX').hide(); }, 3000);
}

function render_card_template(template_name, id, data) {
    const ul_template = plain_get_html_text(template_name);
    const template_html = (data !== undefined) ? Mustache.render(ul_template, data) : ul_template;
    plain_set_html_text(id, template_html);
}

function render_modal_dialog(title, template, data) {
    render_card_template(template, 'DIALOG_BODY', data);
    call_modal_dialog(title);
}

function on_storage_event(storageEvent) {
}

function get_lang_text(name, category, h_id) {
    if (name === 'map' && category === 'info') return h_id;
    if (name === 'phonetic') {
        const id_data = window.ID_DATA[category];
        return id_data[h_id][0];
    }
    return name;
    //const category_data = window.LANG_DATA[name][category];
    // return category_data[h_id];
}

function get_phonetic_text(category, h_id) {
    return get_lang_text('phonetic', category.toLowerCase(), h_id);
}

function get_map_text(category, name) {
    return get_lang_text('map', category, name);
}

function get_month_text(value) {
    if (typeof value !== 'string') return '';
    if (!value.includes(' ')) return '';
    const m_list = value.split(' ');
    if (m_list.length != 3) return '';
    const [ d, m, y ] = m_list;
    const month = get_map_text('month', m);
    if (month === undefined) return '';
    return `${d} ${month} ${y}`;
}

function load_menu_data(lang, nav_category) {
    //transliterator_lang_init(lang);

    const item_list = CATEGORY_DICT['categories'];
    for (const obj of item_list) {
        const name = capitalize_word(obj['C']);
        obj['N'] = get_map_text('info', name);
    }
    const search = get_map_text('info', 'Search');
    const lang_map_dict = window.LANG_DATA['map']['language'];
    const lang_list = [];
    for (let l in lang_map_dict) {
        let d = (l === window.GOT_LANGUAGE) ? { 'N' : l, 'O' : 'selected' } : { 'N' : l };
        lang_list.push(d);
    }
    const menu_dict = { 'menus' : { 'LANGUAGE' : window.GOT_LANGUAGE, 'languages' : lang_list,
                                    'S' : search, 'APP' : 'Android App', 'P' : 'Playlist',
                                    'B' : 'Brightness', 'BI' : 'brightness-high-fill',
                                    'STP' : SEARCH_TOOLTIP, 'MTP' : MIC_TOOLTIP, 'KTP' : KBD_TOOLTIP,
                                    'categories' : CATEGORY_DICT['categories'] }
                      };
    render_card_template('page-menu-template', 'MENU_DATA', menu_dict);
    init_search_listener();

    set_link_initial_active_state()

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    speech_to_text_init();

    load_nav_data(nav_category);
}

function info_transliteration(category, data_list) {
    const lang = window.RENDER_LANGUAGE;
    let item = data_list['title']
    const h_text = item['H'];
    if (category === 'about') {
        item['N'] = get_map_text('info', item['N']);
    } else {
        item['N'] = get_phonetic_text(category, item['T']);
    }
    let item_list = data_list['stats']
    if (item_list === undefined) item_list = [];
    for (const obj of item_list) {
        obj['N'] = get_map_text('info', obj['H']);
    }
}

async function set_language(got_lang, name_lang) {
    window.GOT_LANGUAGE = got_lang;
    const lang_map_dict = window.LANG_DATA['map']['language'];
    const lang = lang_map_dict[got_lang];
    window.RENDER_LANGUAGE = lang;
    const history_data = window.history_data;
    // console.log(`SET LANG: ${lang} ${got_lang} ${history_data}`);
    const l_lang = lang.toLowerCase();
    await fetch_url_data('LANG DATA', `${l_lang}_map.json`);
    load_menu_data(lang, window.NAV_CATEGORY);
    if (history_data === undefined) {
        load_content_data(window.CONTENT_CATEGORY, window.CONTENT_NAME);
    } else  {
        handle_history_context(history_data);
    }
}

function toggle_icon(id, old_class, new_class) {
    plain_remove_class(id, old_class);
    plain_add_class(id, new_class);
}

function toggle_brightness() {
    window.COLOR_SCHEME = (window.COLOR_SCHEME === 'dark') ? 'light' : 'dark';
    const elements = document.getElementsByTagName('html');
    elements[0].setAttribute('data-bs-theme', window.COLOR_SCHEME);
    if (window.COLOR_SCHEME === 'dark') toggle_icon('BRIGHTNESS', 'bi-moon-fill', 'bi-brightness-high-fill');
    else toggle_icon('BRIGHTNESS', 'bi-brightness-high-fill', 'bi-moon-fill');
}

function check_need_poster(category) {
     return category === 'person' || category === 'director';
}

function render_nav_template(category, data) {
    const lang = window.RENDER_LANGUAGE;
    const id_data = window.ID_DATA[category];
    const icon = MENU_ICON_DICT[category];
    const letter_dict = data['letters'][lang.toLowerCase()];
    // console.log(lang, category, letter_dict);
    const new_alphabet_list = [];
    for (let letter in letter_dict) {
        const new_letter_dict = { LL: letter, LU: letter.toUpperCase(), T: category, I: icon };
        const id_list = letter_dict[letter].split(',');
        const item_list = [];
        for (const h_id of id_list) {
            let [h_text, f_text] = id_data[h_id];
            const n_text = get_phonetic_text(category, h_id);
            const item = { I: h_id, H: h_text, N: n_text };
            item_list.push(item);
        }
        new_letter_dict['items'] = item_list;
        new_alphabet_list.push(new_letter_dict);
    }
    const new_data = { alphabet: new_alphabet_list };
    const ul_template = plain_get_html_text('nav-data-template')
    const template_html = Mustache.render(ul_template, new_data);
    plain_set_html_text('MENU', template_html);
    if (window.NAV_SCROLL_SP !== null && window.NAV_SCROLL_SP !== undefined) {
        window.NAV_SCROLL_SP.refresh();
    } else {
        const scroll_element = document.getElementById('ALPHABET_DATA');
        window.NAV_SCROLL_SPY = new bootstrap.ScrollSpy(scroll_element, { target: '#ALPHABET_LIST' });
        const scrollspy = document.querySelector('[data-bs-spy="scroll"]')
        scrollspy.addEventListener('activate.bs.scrollspy', (e) => {
            const a_list = plain_get_query_selector('a');
        })
    }
}

function empty_content_data(category, name) {
    const lang = window.RENDER_LANGUAGE;
    plain_set_html_text('PAGE_TITLE', '');
    plain_set_html_text('PAGE_INFO', '');
    plain_set_html_text('PAGE_DATA', '');
    window.scrollTo(0, 0);
}

function load_about_data(category, video_data) {
    empty_content_data(category, 0);
    //info_transliteration(category, video_data);
    render_card_template('page-title-template', 'PAGE_TITLE', video_data);
    render_card_template('page-about-template', 'PAGE_INFO', video_data);
    render_data_template('', '', video_data);
}

function load_nav_fetch_data(category, url_data) {
    if (category === 'about') {
        load_about_data(category, url_data);
    } else {
        render_nav_template(category, url_data);
    }
    add_history('nav', { 'category' : category });
}

function set_link_initial_active_state() {
    const a_list = plain_get_query_selector('#MENU_DATA li a');
    const a_node = a_list[LINK_ACTIVE_BUTTON].parentNode;
    window.ACTIVE_MENU = a_node;
    a_node.classList.add('active');
}

function clear_link_active_state(prev_element) {
    if (prev_element !== null) prev_element.classList.remove('active');
    return null;
}

function set_link_active_state(element, prev_element) {
    clear_link_active_state(prev_element);
    element = element.parentNode;
    element.classList.add('active');
    return element;
}

function get_folder_value(category, info, prefix, v) {
    const lang = window.RENDER_LANGUAGE;
    const id_data = window.ID_DATA[category];
    const h_name = prefix + 'D';
    const h_id = info[v];
    const [ h_text, f_text ] = id_data[h_id];
    const n_text = get_phonetic_text(category, h_id);
    const f_name = prefix + 'N';
    info[h_name] = h_text;
    info[f_name] = n_text;
}

function get_match_count(f_category, f_value, context_list, c_len) {
    let found = 0;
    for (let c = 1; c < c_len; c++) {
        if (context_list[c][0] === f_category && context_list[c][2] === f_value) found += 1;
    }
    return found;
}

function render_data_template(category, id, data, context_list) {
    const lang = window.RENDER_LANGUAGE;
    if (category === '') return;
    const template_name = `page-${category}-template`;
    let ul_template = plain_get_html_text(template_name);
    const template_html = Mustache.render(ul_template, data);
    plain_set_html_text(id, template_html);
}

function set_start_time(time, index) {
    window.CONTENT_INDEX = index;
    window.CONTENT_INDEX_SET = true;
    load_content_data(window.CONTENT_CATEGORY, window.CONTENT_NAME);
    window.CONTENT_INDEX_SET = false;
    return;
}

function get_geocoder_nominatim() {
    const nominatim =  L.Control.Geocoder.nominatim({
        geocodingQueryParams: { viewbox: BANGALORE_BBOX, countrycodes: 'in', bounded: 1 }
    });
    window.geocoder_nominatim = nominatim;
    return nominatim;
}

function create_osm_map(module, c_lat, c_long, zoom, min_zoom) {
    const map_options  = { center: [ c_lat, c_long ],
                           rotate: true,
                           touchRotate: true,
                           doubleClickZoom: false,
                           zoom: zoom,
                           minZoom: min_zoom,
                           maxZoom: MAX_ZOOM
                         };
    const osm_map = new L.map('MAPINFO', map_options);
    // osm_map.on('zoomend dragend', draw_map_on_move);
    window.map_osm_map = osm_map;
    window.map_osm_layer = new L.LayerGroup();
    osm_map.addLayer(window.map_osm_layer);
    const tile_layer = new L.tileLayer(OSM_TILE_URL, TILE_OPTIONS);
    tile_layer.addTo(osm_map);
    const geocoder = new L.Control.geocoder({ geocoder: get_geocoder_nominatim() });
    geocoder.addTo(osm_map);
    // if (module === 'area') geocoder.on('finishgeocode', handle_geocoder_mark);
    return osm_map;
}

function create_marker_icons() {
    window.nammametro_marker = L.AwesomeMarkers.icon({ icon: 'subway', markerColor: 'blue', prefix: 'fa', iconColor: 'white' });
    window.busstop_marker = L.AwesomeMarkers.icon({ icon: 'bus', markerColor: 'blue', prefix: 'fa', iconColor: 'white' });
    window.neighbor_marker = L.AwesomeMarkers.icon({ icon: 'bus', markerColor: 'purple', prefix: 'fa', iconColor: 'white' });
    window.start_stop_marker = L.AwesomeMarkers.icon({ icon: 'play-circle-o', markerColor: 'orange', prefix: 'fa', iconColor: 'white' });
    window.end_stop_marker = L.AwesomeMarkers.icon({ icon: 'stop-circle', markerColor: 'green', prefix: 'fa', iconColor: 'white' });
}

function marker_on_doubleclick(e) {
    const marker = e.target;
    load_content_data(marker.category, marker.h_id);
}

function add_marker(category, h_id, m_lat, m_long) {
    const marker = new L.marker([m_lat, m_long]);
    marker.state = 'new';
    marker.category = category;
    marker.h_id = h_id;
    const center = window.map_osm_map.getCenter();
    marker.distance = center.distanceTo(marker.getLatLng());
    /*
    marker.on('mouseover', marker_on_mouseover);
    marker.on('mouseout', marker_on_mouseout);
    marker.on('click', marker_on_click);
    marker.on('contextmenu', marker_on_contextmenu);
    */
    marker.on('dblclick', marker_on_doubleclick);
    return marker;
}

function render_content_data(category, h_id, video_data, context_list) {
    const t = video_data['title'];
    t['N'] = get_phonetic_text(category, h_id);
    render_card_template('page-title-template', 'PAGE_TITLE', video_data);

    const stop_data = window.STOP_DATA;
    const route_data = window.window.ROUTE_DATA;;
    const new_data = { 'data' : [] };
    const latlong_list = [];
    if (category === 'busstop') {
        const data_list = video_data['data'];
        for (const obj of data_list[h_id]['routes']) {
            const route_id = obj['id'];
            r_text = get_phonetic_text('busroute', route_id);
            obj['N'] = r_text.split(' : ')[1];
            obj['T'] = obj['time'];
            obj['R'] = r_text.split(' : ')[0];
            route_obj = route_data['data'][route_id]['info'];
            new_data['data'].push(obj);
        }
    } else if (category === 'busroute') {
        const data_list = video_data['data'];
        for (const obj of data_list[h_id]) {
            const stop_id = obj['id'];
            obj['N'] = get_phonetic_text('busstop', stop_id);
            obj['S'] = obj['seq'];
            obj['T'] = obj['time'][window.CONTENT_INDEX];
            new_data['data'].push(obj);
            stop_obj = stop_data['data'][stop_id]['info'];
            latlong_list.push([ stop_obj['lat'], stop_obj['lon'], stop_id ]);
        }
        const obj = data_list[h_id][0];
        time_list = [];
        let i = 0;
        for (const t of obj['time']) {
            time_list.push({ 'O' : i, 'N' : t }); 
            i++;
        }
        new_data['starttime'] = time_list;
        new_data['ST'] = time_list[window.CONTENT_INDEX]['N'];
        new_data['S'] = data_list[h_id].length;
        new_data['F'] = time_list.length;
    }
    render_data_template(category, 'PAGE_DATA', new_data, context_list);

    if (category === 'busstop') {
        const info_data = video_data['data'][h_id]['info'];
        setTimeout(() => {
            osm_map = create_osm_map('area', info_data['lat'], info_data['lon'], AREA_MIN_ZOOM, MIN_ZOOM);
            const marker = add_marker(category, h_id, info_data['lat'], info_data['lon']);
            marker.setIcon(window.busstop_marker);
            window.map_osm_layer.addLayer(marker);
            for (const m_id of info_data['neighbor']) {
                const i_data = stop_data['data'][m_id]['info'];
                const marker = add_marker('busstop', m_id, i_data['lat'], i_data['lon']);
                marker.setIcon(window.neighbor_marker);
                window.map_osm_layer.addLayer(marker);
            }
        }, 0); 
    } else if (category === 'busroute') {
        setTimeout(() => {
            osm_map = create_osm_map('area', latlong_list[0][0], latlong_list[0][1], MIN_ZOOM, MIN_ZOOM);
            for (i = 0; i < latlong_list.length; i++) {
                const marker = add_marker('busstop', latlong_list[i][2], latlong_list[i][0], latlong_list[i][1]);
                if (i == 0) marker.setIcon(window.start_stop_marker);
                else if (i == latlong_list.length - 1) marker.setIcon(window.end_stop_marker);
                else marker.setIcon(window.busstop_marker);
                window.map_osm_layer.addLayer(marker);
            }
        }, 0); 
    } else if (category === 'nammametro') {
        const info_data = video_data['data'][h_id];
        setTimeout(() => {
            osm_map = create_osm_map('area', info_data['lat'], info_data['lon'], AREA_MIN_ZOOM, MIN_ZOOM);
            const marker = add_marker(category, h_id, info_data['lat'], info_data['lon']);
            marker.setIcon(window.nammametro_marker);
            window.map_osm_layer.addLayer(marker);
            for (const m_id of info_data['neighbor']) {
                const i_data = stop_data['data'][m_id]['info'];
                const marker = add_marker('busstop', m_id, i_data['lat'], i_data['lon']);
                marker.setIcon(window.neighbor_marker);
                window.map_osm_layer.addLayer(marker);
            }
        }, 0); 
    }
}

function load_context_search_data(context_list) {
    const [ category, h_id ] = context_list[0].split(':');
    const new_context_list = [];
    for (const context of context_list) {
        new_context_list.push(context.split(':'));
    }
    load_content_data(category, h_id, undefined, new_context_list);
}

function normalize_search_text(search_text) {
    search_text = search_text.toLowerCase();
    search_text = search_text.replace(/(e)\1+/g, 'i');
    search_text = search_text.replace(/(o)\1+/g, 'u');
    //search_text = search_text.replace(/(.)\1+/g, '$1');
    search_text = search_text.replace(/([bcdfgjklpst])h/g, '$1')
    search_text = search_text.replace(/([sd])v/g, '$1w')
    search_text = search_text.replace(/([ao])u/g, 'ow')
    return search_text;
}

function search_load_fetch_data(search_index_obj) {
    const search_engine = window.indic_search_engine;
    let data_id = 0;
    const search_obj = search_index_obj['Search'];
    for (let category in search_obj) {
        const data_list = search_obj[category];
        data_list.forEach(function (data_item, data_index) {
            const h_id = data_item.H;
            const t_list = data_item.A.slice(0, IMP_COUNT);
            const a_list = data_item.A;
            const data_doc = { 'id' : data_id, 'href' : h_id, 'title' : t_list, 'aka' : a_list, 'category' : category, 'pop' : data_item.P };
            search_engine.add(data_doc);
            data_id += 1;
        });
    }
}

function search_init() {
    window.indic_search_engine = new MiniSearch({
        fields: ['title', 'aka'], // fields to index for full-text search
        storeFields: ['href', 'category', 'pop'] // fields to return with search results
    });
    window.search_initialized = false;
    fetch_url_data('SEARCH DATA', 'search_index.json');
    window.search_initialized = true;
}

function get_search_results(search_word, search_options, item_list, id_list, base_pop) {
    const word_list = search_word.split(' ');
    const new_word_list = [];
    for (let word of word_list) {
        if (word !== '') {
            word = normalize_search_text(word);
            new_word_list.push(word);
        }
        search_word = new_word_list.join(' ');
    }
    const lang = window.RENDER_LANGUAGE;
    const results = window.indic_search_engine.search(search_word, search_options);
    if (results.length <= 0) return;
    const max_score = results[0].score;
    // console.log('get_search_results', results);
    for (const result_item of results) {
        if (id_list.has(result_item.id)) continue;
        let pop = result_item.pop;
        pop = ((10 * result_item.score) / max_score) + (0.9 * pop);
        pop = base_pop + pop;
        const category = result_item.category
        const id_data = window.ID_DATA[category];
        const c_name = capitalize_word(category);
        const n_category = (lang === 'English') ? category.toUpperCase() : get_map_text('info', c_name);
        const href = result_item.href;
        const title = get_phonetic_text(category, result_item.href);
        const item = { 'T' : category, 'C' : n_category, 'I' : MENU_ICON_DICT[category],
                       'H' : href, 'N' : title, 'P' : pop, 'S' : results[0].score
                     };
        const need_poster = check_need_poster(category);
        if (need_poster) {
            const poster_data = window.ABOUT_DATA['person'];
            const image_name = poster_data[result_item.href]
            if (image_name !== undefined) {
                item['J'] = `Images/${image_name}.jpg`;
            }
        }
        item_list.push(item);
        id_list.add(result_item.id);
    }
}

function get_tamil_phonetic_word(word) {
    const w_list = [];
    const new_word = word.toLowerCase();
    for (const c of new_word) {
        w_list.push((c in SEARCH_MAP_DICT) ? SEARCH_MAP_DICT[c] : c);
    }
    return w_list.join('');
}

function load_search_part(search_word, non_english) {
    const s_search_word = search_word.replace(/\s/g, '');
    const item_list = [];
    const id_list = new Set();
    let search_options = { prefix: true, boost: { title: 5 }, combineWith: 'AND', fuzzy: term => term.length > 3 ? 0.1 : null };
    get_search_results(search_word, search_options, item_list, id_list, 4000);
    if (search_word !== s_search_word) {
        get_search_results(s_search_word, search_options, item_list, id_list, 1000);
    }
    let n_search_word = '';
    if (non_english) {
        n_search_word = get_tamil_phonetic_word(search_word);
        get_search_results(n_search_word, search_options, item_list, id_list, 5000);
    }
    if (search_word.length > 2) {
        let search_options = { prefix: true, combineWith: 'AND', fuzzy: term => term.length > 3 ? 0.3 : null };
        get_search_results(search_word, search_options, item_list, id_list, 0);
        if (non_english && n_search_word) {
            get_search_results(n_search_word, search_options, item_list, id_list, 0);
        }
        if (search_word !== s_search_word) {
            get_search_results(s_search_word, search_options, item_list, id_list, 0);
        }
    }
    item_list.sort(function (a, b) { return b.P - a.P; });
    const new_item_list = item_list.slice(0, 25);
    //console.log(search_word, new_item_list);
    return new_item_list;
}

function handle_search_word(search_word) {
    const lang = window.RENDER_LANGUAGE;
    const c = search_word.charCodeAt(0);
    if (c > 127) search_word = transliterate_lang_to_hk(search_word);
    const non_english = (0x0B80 <= c && c <= 0x0BFF) ? true : false;
    const context_list = search_word.split(':');
    const context_dict = {};
    let new_item_list = [];
    for (const word of context_list) {
        new_item_list = load_search_part(word, non_english);
        context_dict[word] = new_item_list;
    }
    const result_title = get_map_text('info', 'Search Results');
    const item_data = { 'title' : { 'N': result_title, 'I': 'search' }, 'items' : new_item_list };
    render_card_template('page-title-template', 'PAGE_TITLE', item_data);
    if (context_list.length <= 1) {
        render_card_template('page-search-template', 'PAGE_INFO', item_data);
    } else {
        const row_list = [];
        for (const [i, w] of context_list.entries()) {
            row_list.push({ 'I' : i, 'col' : context_dict[w] });
        }
        const row_data = { 'items' : row_list };
        render_card_template('page-context-search-template', 'PAGE_INFO', row_data);
    }
    render_data_template('', '', item_data);
    window.scrollTo(0, 0);
    add_history('search', { 'category' : window.NAV_CATEGORY, 'search' : search_word });
}

function load_search_data() {
    window.ACTIVE_NAV = clear_link_active_state(window.ACTIVE_NAV);
    let search_word = document.getElementById('SEARCH_WORD').value;
    search_word = decodeURI(search_word);
    handle_search_word(search_word);
}

function init_search_listener() {
    const element = document.getElementById('SEARCH_WORD');
    element.addEventListener('input', load_search_data);
}

function load_search_history(data) {
    empty_content_data(category, 0);
    const search_word = data['search'];
    document.getElementById('SEARCH_WORD').value = search_word;
    handle_search_word(search_word);
}

function handle_context_search() {
    const select_list = plain_get_query_selector('select[id^=COL_]');
    const cols = select_list.length;
    const context_list = [];
    for (const select_element of select_list) {
        const option = select_element.options[select_element.selectedIndex].value;
        if (option === '' || option === undefined) continue;
        const new_option = option.replace(/\s/g, '');
        if (new_option === '' || new_option === undefined) continue;
        context_list.push(option);
    }
    load_context_search_data(context_list);
}

function load_nav_data(category, element) {
    if (category !== 'about') window.NAV_CATEGORY = category;
    if (element !== undefined && category !== 'about') {
        window.ACTIVE_MENU = set_link_active_state(element, window.ACTIVE_MENU);
    }
    const url = `${category}.json`;
    fetch_url_data('NAV DATA', url, [ category ]);
}

function load_content_data(category, h_id, element, new_context_list) {
    if (element !== undefined) {
        window.ACTIVE_NAV = set_link_active_state(element, window.ACTIVE_NAV);
    }
    window.CONTENT_CATEGORY = category;
    window.CONTENT_NAME = h_id;
    if (!window.CONTENT_INDEX_SET) window.CONTENT_INDEX = 0;
    empty_content_data(category, h_id);

    url_data = null;
    if (category === 'busstop') url_data = window.STOP_DATA;
    else if (category === 'busroute') url_data = window.ROUTE_DATA;
    else if (category === 'nammametro') url_data = window.METRO_DATA;
    render_content_data(category, h_id, url_data, new_context_list);
    add_history('content', { 'category' : category, 'name' : h_id });
}

function load_init_data(data_set_list) {
    const lang = window.RENDER_LANGUAGE;
    const [ id_data, about_data, lang_data, stop_data, route_data, metro_data ] = data_set_list;
    if (window.innerWidth < 992) {
        show_modal_dialog(...VIEW_IN_LANDSCAPE_MSG)
    }
    window.CONTENT_INDEX_SET = false;
    window.CONTENT_INDEX = 0;

    window.ID_DATA = id_data;
    window.ABOUT_DATA = about_data;
    window.LANG_DATA = lang_data;
    window.STOP_DATA = stop_data;
    window.ROUTE_DATA = route_data;
    window.METRO_DATA = metro_data;
    load_menu_data(lang, START_NAV_CATEGORY);
    //if (window.default_video !== '') load_content_data(C_SINGLE, window.default_video);
    search_init();

    create_marker_icons();
}

async function fetch_url_data(name, url, args) {
    const url_data = await fetch_url(url);
    if (url_data === null) return null;
    if (name === 'NAV DATA') {
        const category = args[0];
        load_nav_fetch_data(category, url_data);
    } else if (name === 'LANG DATA') {
        window.LANG_DATA = url_data;
    } else if (name === 'CONTENT DATA') {
        const [ category, h_name, new_context_list ] = args;
        render_content_data(category, h_name, url_data, new_context_list);
        if (new_context_list === undefined) {
            add_history('content', { 'category' : category, 'name' : h_name });
        }
    } else if (name === 'SEARCH DATA') {
        search_load_fetch_data(url_data);
    } else if (name === 'VIDEO INFO') {
        const id = args[0];
        render_youtube_video_info(id, url_data);
    } else if (name === 'CONCERT DATA') {
        window.CONCERT_DATA = url_data;
    }
    return url_data;
}

/*
    Speech To Text
*/

function speech_to_text_init() {
    window.speech_recognizing = false;
    window.speech_final_transcript = '';
    window.speech_recognizing = false;
    window.speech_ignore_onend;
    window.speech_start_timestamp;
    if (!('webkitSpeechRecognition' in window)) {
        console.log('Speech not working:');
    } else {
        window.speech_recognition = new webkitSpeechRecognition();
        window.speech_recognition.continuous = true;
        window.speech_recognition.interimResults = true;

        window.speech_recognition.onstart = function() {
            window.speech_recognizing = true;
            console.log('Speech Starting:');
        };

        window.speech_recognition.onerror = function(event) {
            if (event.error === 'no-speech') {
                console.log('Speech Error: No Speech');
                window.speech_ignore_onend = true;
            }
            if (event.error === 'audio-capture') {
                console.log('Speech Error: Audio Capture');
              window.speech_ignore_onend = true;
            }
            if (event.error === 'not-allowed') {
                if (event.timeStamp - window.speech_start_timestamp < 100) {
                    console.log('Speech Error: Info Blocked');
                } else {
                    console.log('Speech Error: Info Denied');
                }
                window.speech_ignore_onend = true;
            }
        };

        window.speech_recognition.onend = function() {
            window.speech_recognizing = false;
            if (window.speech_ignore_onend) {
                console.log('Speech Error: Ignore End');
                return;
            }
            if (!window.speech_final_transcript) {
                console.log('Speech End:');
                return;
            }
        };

        window.speech_recognition.onresult = function(event) {
            let interim_transcript = '';
            /*
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    window.speech_final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
                console.log('Speech Interim: ' + event.resultIndex + ' ' + event.results.length + ' ' + event.results[i][0].transcript);
            }
            console.log('Speech Result: ' + event.resultIndex + ' ' + event.results.length + ' ' + interim_transcript);
            */
            if (event.results.length > 0) {
                window.speech_final_transcript = event.results[0][0].transcript;
            } else {
                window.speech_final_transcript = '';
            }
            if (window.speech_final_transcript || interim_transcript) {
                window.speech_recognition.stop();
                toggle_icon('MIC_IMAGE', 'mic', 'mic-mute');
                document.getElementById('SEARCH_WORD').value = window.speech_final_transcript;
                // console.log('Speech Final: ' + window.speech_final_transcript);
                load_search_data();
            }
        };
    }
}

function speech_start(event) {
    if (!('webkitSpeechRecognition' in window)) return;
    if (window.speech_recognizing) {
        window.speech_recognition.stop();
        return;
    }
    const lang = window.RENDER_LANGUAGE;
    const iso_lang = window.LANG_DATA['map']['iso'][lang];
    window.speech_final_transcript = '';
    window.speech_recognition.lang = iso_lang;
    window.speech_recognition.start();
    window.speech_ignore_onend = false;
    window.speech_start_timestamp = event.timeStamp;
    toggle_icon('MIC_IMAGE', 'mic-mute', 'mic');
}

function load_keyboard(event) {
    set_input_keyboard(window.LANG_DATA['map']['keyboard']);
    get_bs_modal('LANG_KBD').show();
}

function handle_history_context(data) {
    const context = data['context'];
    if (context === 'content') {
        load_content_data(data['category'], data['name']);
    } else if (context === 'nav') {
        load_nav_data(data['category']);
    } else if (context === 'search') {
        load_search_history(data);
    }
}

function handle_popstate(e) {
    const data = e.state;
    if (data === null || data === undefined) return;
    // console.log('POP: ', e);
    window.indic_popstate = true;
    handle_history_context(data);
    const lang = data['language'];
    // set_language({ 'value' : lang });
}

function add_history(context, data) {
    const url = 'mobility.html';
    data['language'] = window.GOT_LANGUAGE;
    if (!window.indic_popstate) {
        data['context'] = context;
        const c_name = capitalize_word(data['category']);
        let title = `${HISTORY_TITLE}: ${c_name}`;
        const name = data['name'];
        if (name !== undefined) title += ' ' + name;
        // console.log('PUSH: ', data, window.indic_popstate);
        history.pushState(data, title, url);
    }
    window.history_data = data;
    window.indic_popstate = false;
}

function post_content_loaded() {
}

function collection_init(collection, default_video) {
    const [ lang, got_lang ] = LANG_PARAMS;
    window.collection_name = collection;
    window.default_video = default_video;

    const elements = document.getElementsByTagName('html');
    window.COLOR_SCHEME = elements[0].getAttribute('data-bs-theme');
    window.RENDER_LANGUAGE = lang;
    window.GOT_LANGUAGE = got_lang;
    window.history_data = undefined;
    window.indic_popstate = false;

    window.NAV_SCROLL_SPY = null;
    window.ACTIVE_MENU = null;
    window.ACTIVE_NAV = null;

    const item_list = CATEGORY_DICT['categories'];
    for (const obj of item_list) {
        MENU_ICON_DICT[obj.C] = obj.I;
    }

    sessionStorage.clear();
    window.addEventListener('storage', on_storage_event, false);
    window.addEventListener('popstate', handle_popstate);

    document.addEventListener('DOMContentLoaded', function() {
        if (document.readyState === "interactive" || document.readyState === "complete" ) {
            setTimeout(post_content_loaded, 0);
        }
    });

    transliterator_init();

    const l_lang = lang.toLowerCase();
    const url_list = [ fetch_url_data('ID DATA', 'id.json'),
                       fetch_url_data('ABOUT DATA', 'about.json'),
                       fetch_url_data('LANG DATA', `${l_lang}_map.json`),
                       fetch_url_data('STOP DATA', `data/busstop.json`),
                       fetch_url_data('ROUTE DATA', `data/busroute.json`),
                       fetch_url_data('METRO DATA', `data/nammametro.json`)
                     ];
    Promise.all(url_list).then((data_set_list) => { load_init_data(data_set_list); });
}

