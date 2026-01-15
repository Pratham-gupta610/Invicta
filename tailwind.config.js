import tailwindAnimate from 'tailwindcss-animate';
import containerQuery from '@tailwindcss/container-queries';
import intersect from 'tailwindcss-intersect';

export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/streamdown/dist/**/*.js'
    ],
    safelist: ['border', 'border-border'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                borderColor: {
                    border: 'hsl(var(--border))'
                },
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                education: {
                    blue: 'hsl(var(--education-blue))',
                    green: 'hsl(var(--education-green))'
                },
                success: 'hsl(var(--success))',
                warning: 'hsl(var(--warning))',
                info: 'hsl(var(--info))',
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    background: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                },
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            backgroundImage: {
                'gradient-primary': 'var(--gradient-primary)',
                'gradient-card': 'var(--gradient-card)',
                'gradient-background': 'var(--gradient-background)'
            },
            boxShadow: {
                card: 'var(--shadow-card)',
                hover: 'var(--shadow-hover)'
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                },
                'fade-in': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'slide-in': {
                    from: {
                        opacity: '0',
                        transform: 'translateX(-20px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                },
                'gradient-shift': {
                    '0%, 100%': {
                        backgroundPosition: '0% 50%'
                    },
                    '50%': {
                        backgroundPosition: '100% 50%'
                    }
                },
                'orb-float': {
                    '0%, 100%': {
                        transform: 'translate(0, 0) scale(1)'
                    },
                    '33%': {
                        transform: 'translate(30px, -30px) scale(1.1)'
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)'
                    }
                },
                'orb-float-desktop': {
                    '0%, 100%': {
                        transform: 'translate(0, 0) scale(1)'
                    },
                    '25%': {
                        transform: 'translate(40px, -40px) scale(1.15)'
                    },
                    '50%': {
                        transform: 'translate(-30px, 30px) scale(0.85)'
                    },
                    '75%': {
                        transform: 'translate(20px, -20px) scale(1.05)'
                    }
                },
                'pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(255, 140, 66, 0.4)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(255, 140, 66, 0.6)'
                    }
                },
                'shimmer': {
                    '0%, 100%': {
                        textShadow: '0 0 20px rgba(255, 140, 66, 0.5)'
                    },
                    '50%': {
                        textShadow: '0 0 30px rgba(255, 140, 66, 0.7)'
                    }
                },
                'fadeInSlideDown': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(-20px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'fadeInSlideUp': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'titleCascade': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(30px) scale(0.95)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0) scale(1)'
                    }
                },
                'badgePulse': {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 20px rgba(255, 140, 66, 0.4)'
                    },
                    '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 30px rgba(255, 140, 66, 0.6)'
                    }
                },
                'gentleBounce': {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    },
                    '50%': {
                        transform: 'translateY(-5px)'
                    }
                },
                'rippleExpand': {
                    from: {
                        width: '0',
                        height: '0',
                        opacity: '0.5'
                    },
                    to: {
                        width: '300px',
                        height: '300px',
                        opacity: '0'
                    }
                },
                'borderGlow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(255, 140, 66, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(255, 140, 66, 0.6)'
                    }
                },
                'floatUp': {
                    from: {
                        transform: 'translateY(0)',
                        opacity: '1'
                    },
                    to: {
                        transform: 'translateY(-30px)',
                        opacity: '0'
                    }
                },
                'textShimmer': {
                    '0%': {
                        backgroundPosition: '0% 50%'
                    },
                    '100%': {
                        backgroundPosition: '200% 50%'
                    }
                },
                'gridPulse': {
                    '0%, 100%': {
                        opacity: '0.02'
                    },
                    '50%': {
                        opacity: '0.04'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-in': 'slide-in 0.5s ease-out',
                'gradient-shift': 'gradient-shift 12s ease infinite',
                'orb-float': 'orb-float 25s ease-in-out infinite',
                'orb-float-desktop': 'orb-float-desktop 20s ease-in-out infinite',
                'pulse': 'pulse 2s ease-in-out infinite',
                'shimmer': 'shimmer 3s ease-in-out infinite',
                'fade-in-slide-down': 'fadeInSlideDown 0.3s ease-out',
                'fade-in-slide-up': 'fadeInSlideUp 0.5s ease-out',
                'title-cascade': 'titleCascade 0.6s ease-out',
                'badge-pulse': 'badgePulse 3s ease-in-out infinite',
                'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
                'ripple-expand': 'rippleExpand 0.6s ease-out',
                'border-glow': 'borderGlow 2s ease-in-out infinite',
                'float-up': 'floatUp 1s ease-out',
                'text-shimmer': 'textShimmer 4s linear infinite',
                'grid-pulse': 'gridPulse 3s ease-in-out infinite'
            }
        }
    },
    plugins: [
        tailwindAnimate,
        containerQuery,
        intersect,
        function ({addUtilities}) {
            addUtilities(
                {
                    '.border-t-solid': {'border-top-style': 'solid'},
                    '.border-r-solid': {'border-right-style': 'solid'},
                    '.border-b-solid': {'border-bottom-style': 'solid'},
                    '.border-l-solid': {'border-left-style': 'solid'},
                    '.border-t-dashed': {'border-top-style': 'dashed'},
                    '.border-r-dashed': {'border-right-style': 'dashed'},
                    '.border-b-dashed': {'border-bottom-style': 'dashed'},
                    '.border-l-dashed': {'border-left-style': 'dashed'},
                    '.border-t-dotted': {'border-top-style': 'dotted'},
                    '.border-r-dotted': {'border-right-style': 'dotted'},
                    '.border-b-dotted': {'border-bottom-style': 'dotted'},
                    '.border-l-dotted': {'border-left-style': 'dotted'},
                },
                ['responsive']
            );
        },
    ],
};
