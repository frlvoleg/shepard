import styles from './AddInfoTitle.module.scss';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface AddInfoTitleProps {
  src: string;
  label: string;
  text: string;
}

export const AddInfoTitle = ({ src, label, text }: AddInfoTitleProps) => {
  return (
    <div className={styles.addInfoTitle}>
      <img src={src} alt="" />
      <div className={styles.label}>
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};
