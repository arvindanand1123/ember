import styled from 'styled-components';

export const Container = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
`;

export const FileSelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PDFViewer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const PDFDocument = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[5]};

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.space[5]};
  }
`;
