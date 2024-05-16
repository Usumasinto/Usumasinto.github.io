

const font = 'ANSI Shadow';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const directories = {
    Education: [
        '',
        '<white>Education</white>',

        '* <a href="https://www.utags.edu.mx/">UTA</a> <yellow>"Computer Science"</yellow> 2017-2021',
        '* <a href="https://www.nebrija.com/">Nebrija University</a> <yellow>"Master in Cybersecurity"</yellow> Expected 01/2025',
        '* <a href="https://www.teccart.qc.ca/">Institut Teccart Montreal</a><yellow>" Computer Support (DEP)"</yellow> 2021-2022',
        ''
    ],
    Projects: [
        '',
        '<white>Projects</white>',
        [
            ['Keylogger',
             'https://github.com/Usumasinto/Keylogger.git',
             'Keylogger created on Python'
            ],
            ['Cybersecurity Content Creator',
             'https://www.instagram.com/hackerdrt/',
             'Posted useful, creative and timely content on social media about Cybersecurity. Educate, inform, and inspire audiences about cybersecurity best practices, emerging threats and industry trends.',
            ],
            ['CTF challenges (Hack The Box)',
            'https://app.hackthebox.com/profile/250783',
            '*Hacker rank*: Completing different Machines (Windows and Linux), practicing a wide variety of vulnerabilities',
           ],
            
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
        ''
    ].flat(),
    Skills: [
        '',
        '<white>languages</white>',

        [
            'JavaScript',
            'Python',
            'SQL',
            'Bash'
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>General Knowledge</white>',
        [
            'React.js',
            'Redux',
            'Next.js',
            'Axios',
            'Express',
            'Django',
            'Linux',
            'Windows',
            'MacOS',
            'Docker',
            'Git',
            'OWASP',
            'Security Tools',
            'Cloud Security',
            'Security Standards',
            'Networking',
        ].map(lib => `* <green>${lib}</green>`),
        ''
    ].flat()
};

const dirs = Object.keys(directories);

const root = '~';
let cwd = root;

const user = 'guest';
const server = 'hackerdrt.com';

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

function print_dirs() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
}

const commands = {
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    ls(dir = null) {
        if (dir) {
            if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
           print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    async joke() {
        // we use programming jokes so it fit better developer portfolio
        const res = await fetch('https://v2.jokeapi.dev/joke/Programming');
        const data = await res.json();
        (async () => {
            if (data.type == 'twopart') {
                const prompt = this.get_prompt();
                this.set_prompt('');
                await this.echo(`Q: ${data.setup}`, {
                    delay: 50,
                    typing: true
                });
                await this.echo(`A: ${data.delivery}`, {
                    delay: 50,
                    typing: true
                });
                this.set_prompt(prompt);
            } else if (data.type === 'single') {
                await this.echo(data.joke, {
                    delay: 50,
                    typing: true
                });
            }
        })();
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    credits() {
        // you can return string or a Promise from a command
        return [
            '',
            '<white>Used libraries:</white>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '* <a href="https://jokeapi.dev/">Joke API</a>',
            ''
        ].join('\n');
    },
    whoami() {
        // you can return string or a Promise from a command
        return [
            '',
            '<white>Cybersecurity Enthusiast | Entry-Level Professional</white>',
            '<p>As a cybersecurity enthusiast with a passion for safeguarding digital assets, I am committed to leveraging my knowledge and skills to contribute effectively to the field.</p>', 
            '<p>I am adept at identifying vulnerabilities, implementing security measures, and mitigating risks to protect organizations from cyber threats. Eager to further develop my expertise and</p>',
            '<p>make meaningful contributions to cybersecurity initiatives, I am seeking opportunities to grow and excel in this dynamic field.</p>',
            ''
        ].join('\n');
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    }
};

// clear is default command that you can turn off with an option
const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => `<white class="command">${cmd}</white>`);
const help = formatter.format(formatted_list);

const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<white class="command">${command}</white><aquamarine>${args}</aquamarine>`;
}]);

$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;]`;
};

const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion(string) {
        // in every function we can use this to reference term object
        const { name, rest } = $.terminal.parse_command(this.get_command());
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    prompt
});

term.pause();

term.on('click', '.command', function() {
   const command = $(this).text();
   term.exec(command, { typing: true, delay: 50 });
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`, { typing: true, delay: 50 });
});

function ready() {
   const seed = rand(256);
   term.echo(() => rainbow(render('Terminal Portfolio'), seed))
       .echo('<white>Welcome to my Portfolio</white>\n')
       .echo('<white>Type help to list all the commands</white>\n').resume();
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}


github('jcubic/jquery.terminal');