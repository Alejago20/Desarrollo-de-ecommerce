type TagTyPe= 'nuevo' | 'agotado';

interface Props {
    contentTag:TagTyPe;
}

const getTagColor=(content:TagTyPe)=>{
    const lowerConten=content.toLocaleLowerCase();
    if (lowerConten==='nuevo') return 'bg-blue-500';
    if (lowerConten==='agotado') return 'bg-black';

    return 'bg-gray-500'
};

export const Tag = ({contentTag}:Props) => {
  return (
    <div 
    className={`text-white w-fit px-2 ${getTagColor(contentTag)}`}>
    
    <p className="uppercase text-xs font-medium">{contentTag} </p>

    </div>
  );
}
