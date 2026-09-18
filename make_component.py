import re

svg = open('public/separator.svg').read()
path = re.search(r'd="([^"]+)"', svg).group(1)

component = f"""
export default function SeparatorLine() {{
  return (
    <div className="w-full bg-white flex justify-center py-8">
      <svg
        viewBox="21.1 22.9 494 43.7"
        className="w-full max-w-4xl h-auto text-[#C9A84C] px-6"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="{path}"
        />
      </svg>
    </div>
  );
}}
"""
with open('src/app/components/home/SeparatorLine.tsx', 'w') as f:
    f.write(component.strip() + "\\n")
